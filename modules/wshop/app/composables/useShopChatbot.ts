import { ref, computed } from "vue"
import type { Product } from "~~/types"

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  productSuggestions?: Product[]
  quickReplies?: string[]
  orderStatus?: {
    orderId: string
    status: string
    tracking?: string
  }
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  context: {
    userId?: string
    cartItems: string[]
    browsingHistory: string[]
    recentOrders: string[]
  }
  startedAt: Date
  lastActivityAt: Date
}

export interface ChatbotConfig {
  welcomeMessage: string
  enableProductSuggestions: boolean
  enableOrderTracking: boolean
  enableFAQ: boolean
  maxSuggestions: number
  typingDelay: number
}

export const useShopChatbot = (config: ChatbotConfig = {
  welcomeMessage: "Hi! How can I help you today?",
  enableProductSuggestions: true,
  enableOrderTracking: true,
  enableFAQ: true,
  maxSuggestions: 3,
  typingDelay: 500,
}) => {
  const session = ref<ChatSession | null>(null)
  const messages = ref<ChatMessage[]>([])
  const isTyping = ref(false)
  const isOpen = ref(false)
  const unreadCount = ref(0)

  const initSession = async (userId?: string): Promise<ChatSession> => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      messages: [],
      context: {
        userId,
        cartItems: [],
        browsingHistory: [],
        recentOrders: [],
      },
      startedAt: new Date(),
      lastActivityAt: new Date(),
    }

    // Load context if user is logged in
    if (userId) {
      const context = await $fetch<ChatSession["context"]>(`/api/shop/chatbot/context/${userId}`)
      newSession.context = context
    }

    session.value = newSession

    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: config.welcomeMessage,
      timestamp: new Date(),
      quickReplies: ["Find products", "Track order", "Get help"],
    }
    messages.value.push(welcomeMessage)

    return newSession
  }

  const sendMessage = async (content: string): Promise<void> => {
    if (!session.value) {
      await initSession()
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    }
    messages.value.push(userMessage)

    // Show typing indicator
    isTyping.value = true

    try {
      // Get AI response
      const response = await $fetch<{
        message: string
        productSuggestions?: Product[]
        quickReplies?: string[]
        orderStatus?: ChatMessage["orderStatus"]
        action?: "add_to_cart" | "navigate" | "show_products"
        actionData?: Record<string, unknown>
      }>("/api/shop/chatbot/message", {
        method: "POST",
        body: {
          sessionId: session.value!.id,
          message: content,
          context: session.value!.context,
        },
      })

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, config.typingDelay))

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
        productSuggestions: response.productSuggestions,
        quickReplies: response.quickReplies,
        orderStatus: response.orderStatus,
      }
      messages.value.push(assistantMessage)

      // Handle actions
      if (response.action && response.actionData) {
        handleAction(response.action, response.actionData)
      }
    } finally {
      isTyping.value = false
    }
  }

  const handleAction = (action: string, data: Record<string, unknown>): void => {
    switch (action) {
      case "add_to_cart":
        // Add product to cart
        break
      case "navigate":
        // Navigate to page
        if (data.url) {
          navigateTo(data.url as string)
        }
        break
      case "show_products":
        // Show product results
        break
    }
  }

  const suggestProducts = async (query: string): Promise<Product[]> => {
    return await $fetch<Product[]>("/api/shop/chatbot/suggest", {
      method: "POST",
      body: { query },
    })
  }

  const trackOrder = async (orderId: string): Promise<ChatMessage["orderStatus"]> => {
    return await $fetch(`/api/shop/chatbot/track-order`, {
      method: "POST",
      body: { orderId },
    })
  }

  const getFAQ = async (question: string): Promise<string> => {
    const result = await $fetch<{ answer: string }>("/api/shop/chatbot/faq", {
      method: "POST",
      body: { question },
    })
    return result.answer
  }

  const clearChat = (): void => {
    messages.value = []
    unreadCount.value = 0
  }

  const toggleChat = (): void => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      unreadCount.value = 0
    }
  }

  const openChat = (): void => {
    isOpen.value = true
    unreadCount.value = 0
  }

  const closeChat = (): void => {
    isOpen.value = false
  }

  const addSystemMessage = (content: string): void => {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: "system",
      content,
      timestamp: new Date(),
    }
    messages.value.push(message)
  }

  const getChatHistory = async (userId: string): Promise<ChatSession[]> => {
    return await $fetch<ChatSession[]>(`/api/shop/chatbot/history/${userId}`)
  }

  const canTrigger = computed(() => {
    // Check if chatbot should auto-trigger based on user behavior
    return messages.value.length === 1 && !isOpen.value
  })

  return {
    session: computed(() => session.value),
    messages: computed(() => messages.value),
    isTyping: computed(() => isTyping.value),
    isOpen: computed(() => isOpen.value),
    unreadCount: computed(() => unreadCount.value),
    canTrigger,
    initSession,
    sendMessage,
    suggestProducts,
    trackOrder,
    getFAQ,
    clearChat,
    toggleChat,
    openChat,
    closeChat,
    addSystemMessage,
    getChatHistory,
  }
}
