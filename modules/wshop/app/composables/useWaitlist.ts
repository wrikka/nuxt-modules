import { ref, computed } from "vue"
import type { Product } from "~~/types"

export interface WaitlistEntry {
  id: string
  productId: string
  productName: string
  customerId: string
  customerEmail: string
  customerName: string
  status: "waiting" | "notified" | "purchased" | "expired" | "cancelled"
  quantity: number
  preferredVariantId?: string
  maxPrice?: number
  notes?: string
  createdAt: Date
  notifiedAt?: Date
  purchasedAt?: Date
  expiresAt?: Date
  priority: number
}

export interface Backorder {
  id: string
  productId: string
  orderId: string
  quantity: number
  status: "pending" | "ordered" | "received" | "fulfilled" | "cancelled"
  expectedDate?: Date
  supplierId?: string
  costPerUnit: number
  createdAt: Date
  updatedAt: Date
}

export const useWaitlist = () => {
  const waitlist = ref<WaitlistEntry[]>([])
  const backorders = ref<Backorder[]>([])
  const loading = ref(false)

  const joinWaitlist = async (data: {
    productId: string
    quantity: number
    preferredVariantId?: string
    maxPrice?: number
    notes?: string
    priority?: number
  }): Promise<WaitlistEntry> => {
    loading.value = true
    try {
      const entry = await $fetch<WaitlistEntry>("/api/shop/waitlist", {
        method: "POST",
        body: data,
      })
      waitlist.value.push(entry)
      return entry
    } finally {
      loading.value = false
    }
  }

  const leaveWaitlist = async (entryId: string): Promise<void> => {
    await $fetch(`/api/shop/waitlist/${entryId}`, {
      method: "DELETE",
    })

    waitlist.value = waitlist.value.filter(e => e.id !== entryId)
  }

  const getWaitlistPosition = async (entryId: string): Promise<number> => {
    const result = await $fetch<{ position: number }>(`/api/shop/waitlist/${entryId}/position`)
    return result.position
  }

  const notifyWaitlist = async (productId: string, quantity: number): Promise<number> => {
    const result = await $fetch<{ notified: number }>("/api/shop/waitlist/notify", {
      method: "POST",
      body: { productId, quantity },
    })

    // Update local waitlist
    waitlist.value = waitlist.value.map(e =>
      e.productId === productId && e.status === "waiting" && quantity > 0
        ? { ...e, status: "notified", notifiedAt: new Date() }
        : e,
    )

    return result.notified
  }

  const createBackorder = async (data: {
    productId: string
    orderId: string
    quantity: number
    expectedDate?: Date
    supplierId?: string
    costPerUnit: number
  }): Promise<Backorder> => {
    const backorder = await $fetch<Backorder>("/api/shop/backorders", {
      method: "POST",
      body: data,
    })
    backorders.value.push(backorder)
    return backorder
  }

  const updateBackorder = async (backorderId: string, updates: Partial<Backorder>): Promise<Backorder> => {
    const backorder = await $fetch<Backorder>(`/api/shop/backorders/${backorderId}`, {
      method: "PUT",
      body: updates,
    })

    const index = backorders.value.findIndex(b => b.id === backorderId)
    if (index !== -1) {
      backorders.value[index] = backorder
    }

    return backorder
  }

  const fulfillBackorder = async (backorderId: string): Promise<void> => {
    await $fetch(`/api/shop/backorders/${backorderId}/fulfill`, {
      method: "POST",
    })

    const index = backorders.value.findIndex(b => b.id === backorderId)
    if (index !== -1) {
      backorders.value[index].status = "fulfilled"
    }
  }

  const getCustomerWaitlist = async (customerId: string): Promise<WaitlistEntry[]> => {
    const data = await $fetch<WaitlistEntry[]>(`/api/shop/waitlist/customer/${customerId}`)
    waitlist.value = data
    return data
  }

  const getProductWaitlist = async (productId: string): Promise<WaitlistEntry[]> => {
    return await $fetch<WaitlistEntry[]>(`/api/shop/waitlist/product/${productId}`)
  }

  const isOnWaitlist = (productId: string): boolean => {
    return waitlist.value.some(e => e.productId === productId && e.status === "waiting")
  }

  const waitlistCount = computed(() => waitlist.value.length)

  const waitingEntries = computed(() =>
    waitlist.value.filter(e => e.status === "waiting"),
  )

  const notifiedEntries = computed(() =>
    waitlist.value.filter(e => e.status === "notified"),
  )

  return {
    waitlist: computed(() => waitlist.value),
    backorders: computed(() => backorders.value),
    loading: computed(() => loading.value),
    waitlistCount,
    waitingEntries,
    notifiedEntries,
    joinWaitlist,
    leaveWaitlist,
    getWaitlistPosition,
    notifyWaitlist,
    createBackorder,
    updateBackorder,
    fulfillBackorder,
    getCustomerWaitlist,
    getProductWaitlist,
    isOnWaitlist,
  }
}
