import { ref, computed } from "vue"
import type { Product } from "~~/types"

export interface GiftCard {
  id: string
  code: string
  balance: number
  initialValue: number
  currency: string
  status: "active" | "redeemed" | "expired" | "cancelled"
  recipientEmail?: string
  recipientName?: string
  senderName?: string
  message?: string
  expiresAt?: Date
  redeemedAt?: Date
  redeemedBy?: string
  createdAt: Date
  design: string
}

export interface GiftCardDesign {
  id: string
  name: string
  thumbnail: string
  theme: "birthday" | "holiday" | "thank_you" | "general" | "custom"
}

export interface GiftCardTransaction {
  id: string
  giftCardId: string
  type: "purchase" | "redemption" | "refund" | "reload"
  amount: number
  orderId?: string
  remainingBalance: number
  createdAt: Date
}

export const useGiftCards = () => {
  const giftCards = ref<GiftCard[]>([])
  const currentCard = ref<GiftCard | null>(null)
  const transactions = ref<GiftCardTransaction[]>([])
  const designs = ref<GiftCardDesign[]>([
    { id: "birthday-1", name: "Birthday Celebration", thumbnail: "/giftcards/birthday-1.jpg", theme: "birthday" },
    { id: "holiday-1", name: "Holiday Season", thumbnail: "/giftcards/holiday-1.jpg", theme: "holiday" },
    { id: "thankyou-1", name: "Thank You", thumbnail: "/giftcards/thankyou-1.jpg", theme: "thank_you" },
    { id: "general-1", name: "Classic", thumbnail: "/giftcards/general-1.jpg", theme: "general" },
  ])
  const loading = ref(false)

  const generateCode = (): string => {
    const prefix = "GC"
    const random = Math.random().toString(36).substring(2, 10).toUpperCase()
    return `${prefix}-${random.slice(0, 4)}-${random.slice(4, 8)}`
  }

  const createGiftCard = async (data: {
    amount: number
    currency: string
    recipientEmail?: string
    recipientName?: string
    senderName?: string
    message?: string
    design: string
    expiresInDays?: number
  }): Promise<GiftCard> => {
    loading.value = true
    try {
      const card = await $fetch<GiftCard>("/api/shop/gift-cards", {
        method: "POST",
        body: {
          ...data,
          code: generateCode(),
        },
      })
      giftCards.value.push(card)
      return card
    } finally {
      loading.value = false
    }
  }

  const getGiftCard = async (code: string): Promise<GiftCard> => {
    const card = await $fetch<GiftCard>("/api/shop/gift-cards/check", {
      params: { code },
    })
    currentCard.value = card
    return card
  }

  const redeemGiftCard = async (code: string, customerId: string): Promise<GiftCard> => {
    const card = await $fetch<GiftCard>("/api/shop/gift-cards/redeem", {
      method: "POST",
      body: { code, customerId },
    })
    currentCard.value = card
    return card
  }

  const applyToCart = async (code: string, cartId: string): Promise<{
    applied: boolean
    amount: number
    remainingBalance: number
  }> => {
    return await $fetch("/api/shop/gift-cards/apply", {
      method: "POST",
      body: { code, cartId },
    })
  }

  const reloadGiftCard = async (code: string, amount: number): Promise<GiftCard> => {
    const card = await $fetch<GiftCard>("/api/shop/gift-cards/reload", {
      method: "POST",
      body: { code, amount },
    })
    currentCard.value = card
    return card
  }

  const cancelGiftCard = async (code: string): Promise<void> => {
    await $fetch(`/api/shop/gift-cards/${code}/cancel`, {
      method: "POST",
    })

    const index = giftCards.value.findIndex(c => c.code === code)
    if (index !== -1) {
      giftCards.value[index].status = "cancelled"
    }
  }

  const getTransactions = async (code: string): Promise<GiftCardTransaction[]> => {
    const data = await $fetch<GiftCardTransaction[]>(`/api/shop/gift-cards/${code}/transactions`)
    transactions.value = data
    return data
  }

  const getBalance = (code: string): Promise<number> => {
    return $fetch<number>("/api/shop/gift-cards/balance", {
      params: { code },
    })
  }

  const sendGiftCardEmail = async (code: string): Promise<void> => {
    await $fetch(`/api/shop/gift-cards/${code}/send`, {
      method: "POST",
    })
  }

  const validateCode = (code: string): boolean => {
    const pattern = /^GC-[A-Z0-9]{4}-[A-Z0-9]{4}$/
    return pattern.test(code)
  }

  const activeCards = computed(() =>
    giftCards.value.filter(c => c.status === "active"),
  )

  const totalBalance = computed(() =>
    activeCards.value.reduce((sum, card) => sum + card.balance, 0),
  )

  return {
    giftCards: computed(() => giftCards.value),
    currentCard: computed(() => currentCard.value),
    transactions: computed(() => transactions.value),
    designs: computed(() => designs.value),
    loading: computed(() => loading.value),
    activeCards,
    totalBalance,
    createGiftCard,
    getGiftCard,
    redeemGiftCard,
    applyToCart,
    reloadGiftCard,
    cancelGiftCard,
    getTransactions,
    getBalance,
    sendGiftCardEmail,
    validateCode,
  }
}
