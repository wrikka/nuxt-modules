import { ref, computed } from "vue"

export interface QRCodeSession {
  id: string
  code: string
  type: "payment" | "product" | "store"
  data: {
    amount?: number
    currency?: string
    productId?: string
    storeUrl?: string
  }
  status: "pending" | "scanned" | "completed" | "expired"
  createdAt: Date
  expiresAt: Date
  scannedAt?: Date
  completedAt?: Date
  scannedBy?: string
}

export interface QRPaymentMethod {
  id: string
  name: string
  type: "promptpay" | "mobile_banking" | "e_wallet" | "crypto"
  icon: string
  enabled: boolean
  config: Record<string, string>
}

export const useQRCheckout = () => {
  const currentSession = ref<QRCodeSession | null>(null)
  const paymentMethods = ref<QRPaymentMethod[]>([
    { id: "promptpay", name: "PromptPay", type: "promptpay", icon: "promptpay", enabled: true, config: {} },
    { id: "mobile_banking", name: "Mobile Banking", type: "mobile_banking", icon: "bank", enabled: true, config: {} },
    { id: "e_wallet", name: "E-Wallet", type: "e_wallet", icon: "wallet", enabled: true, config: {} },
  ])
  const loading = ref(false)
  const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null)

  const generatePaymentQR = async (amount: number, currency = "THB"): Promise<QRCodeSession> => {
    loading.value = true
    try {
      const session = await $fetch<QRCodeSession>("/api/shop/qr/payment", {
        method: "POST",
        body: { amount, currency },
      })
      currentSession.value = session
      startPolling(session.id)
      return session
    } finally {
      loading.value = false
    }
  }

  const generateProductQR = async (productId: string): Promise<QRCodeSession> => {
    const session = await $fetch<QRCodeSession>("/api/shop/qr/product", {
      method: "POST",
      body: { productId },
    })
    currentSession.value = session
    return session
  }

  const generateStoreQR = async (): Promise<QRCodeSession> => {
    const session = await $fetch<QRCodeSession>("/api/shop/qr/store", {
      method: "POST",
    })
    currentSession.value = session
    return session
  }

  const startPolling = (sessionId: string) => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value)
    }

    pollingInterval.value = setInterval(async () => {
      const status = await checkSessionStatus(sessionId)
      if (status === "completed" || status === "expired") {
        stopPolling()
      }
    }, 2000)
  }

  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value)
      pollingInterval.value = null
    }
  }

  const checkSessionStatus = async (sessionId: string): Promise<QRCodeSession["status"]> => {
    const session = await $fetch<QRCodeSession>(`/api/shop/qr/${sessionId}/status`)
    currentSession.value = session
    return session.status
  }

  const scanQRCode = async (code: string, customerId?: string): Promise<QRCodeSession> => {
    const session = await $fetch<QRCodeSession>("/api/shop/qr/scan", {
      method: "POST",
      body: { code, customerId },
    })
    currentSession.value = session
    return session
  }

  const completePayment = async (sessionId: string, paymentMethod: string): Promise<void> => {
    await $fetch(`/api/shop/qr/${sessionId}/complete`, {
      method: "POST",
      body: { paymentMethod },
    })
  }

  const cancelSession = async (sessionId: string): Promise<void> => {
    await $fetch(`/api/shop/qr/${sessionId}/cancel`, {
      method: "POST",
    })
    stopPolling()
  }

  const downloadQRImage = async (sessionId: string): Promise<string> => {
    const result = await $fetch<{ url: string }>(`/api/shop/qr/${sessionId}/download`)
    return result.url
  }

  const getPromptPayQR = async (amount: number, mobileNumber: string): Promise<string> => {
    const result = await $fetch<{ qrData: string }>("/api/shop/qr/promptpay", {
      method: "POST",
      body: { amount, mobileNumber },
    })
    return result.qrData
  }

  const isSessionActive = computed(() =>
    currentSession.value?.status === "pending" || currentSession.value?.status === "scanned",
  )

  const canComplete = computed(() =>
    currentSession.value?.status === "scanned",
  )

  return {
    currentSession: computed(() => currentSession.value),
    paymentMethods: computed(() => paymentMethods.value),
    loading: computed(() => loading.value),
    isSessionActive,
    canComplete,
    generatePaymentQR,
    generateProductQR,
    generateStoreQR,
    checkSessionStatus,
    scanQRCode,
    completePayment,
    cancelSession,
    downloadQRImage,
    getPromptPayQR,
    stopPolling,
  }
}
