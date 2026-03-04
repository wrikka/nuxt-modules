import { ref, computed, onMounted, onUnmounted } from "vue"
import type { Cart } from "~~/types"

export interface AbandonedCartConfig {
  timeoutMinutes: number
  reminderIntervals: number[]
  maxReminders: number
}

export interface AbandonedCartData {
  id: string
  cart: Cart
  abandonedAt: Date
  remindersSent: number
  recoveredAt?: Date
  recoveryMethod?: "email" | "push" | "sms"
}

export const useAbandonedCart = (config: AbandonedCartConfig = {
  timeoutMinutes: 30,
  reminderIntervals: [1, 24, 72],
  maxReminders: 3,
}) => {
  const abandonedCarts = ref<AbandonedCartData[]>([])
  const currentAbandonedCart = ref<AbandonedCartData | null>(null)
  const isMonitoring = ref(false)
  let monitoringInterval: ReturnType<typeof setInterval> | null = null

  const startMonitoring = () => {
    if (isMonitoring.value) return

    isMonitoring.value = true
    monitoringInterval = setInterval(async () => {
      await checkAbandonedCarts()
    }, 60000) // Check every minute
  }

  const stopMonitoring = () => {
    isMonitoring.value = false
    if (monitoringInterval) {
      clearInterval(monitoringInterval)
      monitoringInterval = null
    }
  }

  const checkAbandonedCarts = async () => {
    try {
      const carts = await $fetch<AbandonedCartData[]>("/api/shop/abandoned-carts/check")
      abandonedCarts.value = carts
    } catch {
      // Silently fail
    }
  }

  const markCartAbandoned = async (cartId: string): Promise<AbandonedCartData> => {
    const data = await $fetch<AbandonedCartData>("/api/shop/abandoned-carts", {
      method: "POST",
      body: {
        cartId,
        abandonedAt: new Date().toISOString(),
      },
    })
    currentAbandonedCart.value = data
    return data
  }

  const recoverCart = async (abandonedCartId: string, method: "email" | "push" | "sms") => {
    const data = await $fetch<AbandonedCartData>(`/api/shop/abandoned-carts/${abandonedCartId}/recover`, {
      method: "POST",
      body: { recoveryMethod: method },
    })

    const index = abandonedCarts.value.findIndex(c => c.id === abandonedCartId)
    if (index !== -1) {
      abandonedCarts.value[index] = data
    }

    return data
  }

  const sendReminder = async (abandonedCartId: string, method: "email" | "push" | "sms") => {
    const data = await $fetch<AbandonedCartData>(`/api/shop/abandoned-carts/${abandonedCartId}/remind`, {
      method: "POST",
      body: { method },
    })

    const index = abandonedCarts.value.findIndex(c => c.id === abandonedCartId)
    if (index !== -1) {
      abandonedCarts.value[index] = data
    }

    return data
  }

  const getRecoveryRate = async (days = 30): Promise<number> => {
    const stats = await $fetch<{ recovered: number; total: number }>("/api/shop/abandoned-carts/stats", {
      params: { days },
    })
    return stats.total > 0 ? (stats.recovered / stats.total) * 100 : 0
  }

  const getAbandonedCartValue = computed(() => {
    return abandonedCarts.value.reduce((total, cart) => {
      return total + (cart.cart?.total || 0)
    }, 0)
  })

  onMounted(() => {
    startMonitoring()
  })

  onUnmounted(() => {
    stopMonitoring()
  })

  return {
    abandonedCarts: computed(() => abandonedCarts.value),
    currentAbandonedCart: computed(() => currentAbandonedCart.value),
    isMonitoring: computed(() => isMonitoring.value),
    abandonedCartValue: getAbandonedCartValue,
    startMonitoring,
    stopMonitoring,
    markCartAbandoned,
    recoverCart,
    sendReminder,
    getRecoveryRate,
  }
}
