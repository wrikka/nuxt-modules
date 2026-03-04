import { ref, computed, watch, onMounted, onUnmounted } from "vue"
import type { Product } from "~~/types"

export interface InventorySyncConfig {
  syncInterval: number
  enableRealtime: boolean
  channels: string[]
}

export interface InventoryUpdate {
  productId: string
  variantId?: string
  quantity: number
  location: string
  channel: string
  timestamp: string
}

export interface InventoryAlert {
  type: "low_stock" | "out_of_stock" | "overstock"
  productId: string
  productName: string
  currentQuantity: number
  threshold: number
  location: string
}

export const useInventorySync = (config: InventorySyncConfig = {
  syncInterval: 30000,
  enableRealtime: true,
  channels: ["web", "pos", "marketplace"],
}) => {
  const inventory = ref<Map<string, number>>(new Map())
  const pendingUpdates = ref<InventoryUpdate[]>([])
  const alerts = ref<InventoryAlert[]>([])
  const isConnected = ref(false)
  const lastSync = ref<Date | null>(null)
  let syncInterval: ReturnType<typeof setInterval> | null = null
  let ws: WebSocket | null = null

  const connectRealtime = () => {
    if (!config.enableRealtime || typeof window === "undefined") return

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    ws = new WebSocket(`${protocol}//${window.location.host}/api/shop/inventory/ws`)

    ws.onopen = () => {
      isConnected.value = true
    }

    ws.onmessage = (event) => {
      const update: InventoryUpdate = JSON.parse(event.data)
      updateLocalInventory(update)
    }

    ws.onclose = () => {
      isConnected.value = false
      // Reconnect after 5 seconds
      setTimeout(connectRealtime, 5000)
    }
  }

  const disconnectRealtime = () => {
    ws?.close()
    ws = null
    isConnected.value = false
  }

  const updateLocalInventory = (update: InventoryUpdate) => {
    const key = update.variantId
      ? `${update.productId}:${update.variantId}`
      : update.productId
    inventory.value.set(key, update.quantity)
  }

  const syncInventory = async (force = false): Promise<void> => {
    try {
      const data = await $fetch<InventoryUpdate[]>("/api/shop/inventory/sync", {
        params: {
          since: lastSync.value?.toISOString(),
          force,
        },
      })

      data.forEach(update => updateLocalInventory(update))
      lastSync.value = new Date()

      // Clear pending updates that were synced
      pendingUpdates.value = pendingUpdates.value.filter(
        p => !data.some(s =>
          s.productId === p.productId &&
          s.variantId === p.variantId &&
          s.channel === p.channel,
        ),
      )
    } catch {
      // Keep pending updates for retry
    }
  }

  const updateInventory = async (
    productId: string,
    quantity: number,
    location: string,
    variantId?: string,
  ): Promise<void> => {
    const update: InventoryUpdate = {
      productId,
      variantId,
      quantity,
      location,
      channel: "web",
      timestamp: new Date().toISOString(),
    }

    // Optimistic update
    updateLocalInventory(update)

    // Queue for sync
    pendingUpdates.value.push(update)

    // Send immediately if realtime connected
    if (isConnected.value && ws) {
      ws.send(JSON.stringify(update))
    }

    // Background sync
    try {
      await $fetch("/api/shop/inventory/update", {
        method: "POST",
        body: update,
      })
    } catch {
      // Will retry on next sync
    }
  }

  const reserveInventory = async (
    productId: string,
    quantity: number,
    reservationId: string,
    expiresAt: Date,
    variantId?: string,
  ): Promise<boolean> => {
    try {
      const result = await $fetch<{ success: boolean }>("/api/shop/inventory/reserve", {
        method: "POST",
        body: {
          productId,
          variantId,
          quantity,
          reservationId,
          expiresAt: expiresAt.toISOString(),
        },
      })

      if (result.success) {
        const key = variantId ? `${productId}:${variantId}` : productId
        const current = inventory.value.get(key) || 0
        inventory.value.set(key, current - quantity)
      }

      return result.success
    } catch {
      return false
    }
  }

  const releaseReservation = async (reservationId: string): Promise<void> => {
    await $fetch(`/api/shop/inventory/reservations/${reservationId}`, {
      method: "DELETE",
    })
  }

  const getStockLevel = (productId: string, variantId?: string): number => {
    const key = variantId ? `${productId}:${variantId}` : productId
    return inventory.value.get(key) || 0
  }

  const isLowStock = (productId: string, threshold = 10, variantId?: string): boolean => {
    return getStockLevel(productId, variantId) <= threshold
  }

  const isOutOfStock = (productId: string, variantId?: string): boolean => {
    return getStockLevel(productId, variantId) <= 0
  }

  const fetchAlerts = async (): Promise<void> => {
    try {
      const data = await $fetch<InventoryAlert[]>("/api/shop/inventory/alerts")
      alerts.value = data
    } catch {
      // Ignore errors
    }
  }

  const startSync = () => {
    syncInterval = setInterval(() => {
      syncInventory()
    }, config.syncInterval)
  }

  const stopSync = () => {
    if (syncInterval) {
      clearInterval(syncInterval)
      syncInterval = null
    }
  }

  onMounted(() => {
    connectRealtime()
    startSync()
    syncInventory(true)
    fetchAlerts()
  })

  onUnmounted(() => {
    disconnectRealtime()
    stopSync()
  })

  return {
    inventory: computed(() => inventory.value),
    pendingUpdates: computed(() => pendingUpdates.value),
    alerts: computed(() => alerts.value),
    isConnected: computed(() => isConnected.value),
    lastSync: computed(() => lastSync.value),
    syncInventory,
    updateInventory,
    reserveInventory,
    releaseReservation,
    getStockLevel,
    isLowStock,
    isOutOfStock,
    fetchAlerts,
    startSync,
    stopSync,
  }
}
