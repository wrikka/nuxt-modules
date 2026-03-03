import { computed } from 'vue'
import { useChatStore } from '../stores/core'
import { useChatApi } from './useChatApi'
import type { ChatMessage, ChatSession } from '../types/domain'

export function useChatState() {
  const chatStore = useChatStore()
  const chatApi = useChatApi()

  // Computed properties from store
  const currentSession = computed(() => chatStore.currentSession)
  const sessions = computed(() => chatStore.sessions)
  const isLoading = computed(() => chatStore.isLoading || chatApi.isLoading.value)
  const error = computed(() => chatStore.error || chatApi.error.value)
  const currentSessionMessages = computed(() => chatStore.currentSessionMessages)
  const hasActiveSession = computed(() => chatStore.hasActiveSession)

  // Enhanced computed properties
  const messageCount = computed(() => currentSessionMessages.value.length)
  const lastMessage = computed(() => {
    const messages = currentSessionMessages.value
    return messages.length > 0 ? messages[messages.length - 1] : null
  })

  const unreadCount = computed(() => {
    // This would typically track unread messages
    return 0 // Implement based on your requirements
  })

  const sessionTitle = computed(() => {
    return currentSession.value?.title || 'New Chat'
  })

  const canSendMessage = computed(() => {
    return hasActiveSession.value && !isLoading.value
  })

  const isTyping = computed(() => {
    // This would track if someone is typing
    return false // Implement based on your requirements
  })

  // Actions that combine store and API
  const loadSessions = async () => {
    try {
      chatStore.setLoading(true)
      const response = await chatApi.getSessions()
      chatStore.sessions = response.data
    } catch (error) {
      chatStore.setError(error.message)
    } finally {
      chatStore.setLoading(false)
    }
  }

  const loadSession = async (sessionId: string) => {
    try {
      chatStore.setLoading(true)
      chatStore.clearError()

      const session = await chatApi.getSession(sessionId)
      chatStore.setCurrentSession(session)

      // Load messages for the session
      const messagesResponse = await chatApi.getMessages(sessionId)
      session.messages = messagesResponse.data

    } catch (error) {
      chatStore.setError(error.message)
      throw error
    } finally {
      chatStore.setLoading(false)
    }
  }

  const createNewSession = async (title?: string) => {
    try {
      chatStore.setLoading(true)
      chatStore.clearError()

      const sessionTitle = title || `Chat ${new Date().toLocaleString()}`
      const session = await chatApi.createSession(sessionTitle)

      chatStore.addSession(session)
      return session

    } catch (error) {
      chatStore.setError(error.message)
      throw error
    } finally {
      chatStore.setLoading(false)
    }
  }

  const switchSession = (sessionId: string) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      chatStore.setCurrentSession(session)
    }
  }

  const closeCurrentSession = () => {
    chatStore.setCurrentSession(null)
  }

  const deleteCurrentSession = async () => {
    if (!currentSession.value) return

    try {
      chatStore.setLoading(true)
      await chatApi.deleteSession(currentSession.value.id)
      chatStore.deleteSession(currentSession.value.id)
    } catch (error) {
      chatStore.setError(error.message)
      throw error
    } finally {
      chatStore.setLoading(false)
    }
  }

  const updateCurrentSession = async (updates: Partial<ChatSession>) => {
    if (!currentSession.value) return

    try {
      chatStore.setLoading(true)
      const updatedSession = await chatApi.updateSession(currentSession.value.id, updates)
      chatStore.updateSession(currentSession.value.id, updatedSession)
    } catch (error) {
      chatStore.setError(error.message)
      throw error
    } finally {
      chatStore.setLoading(false)
    }
  }

  // Message management
  const addMessageToCurrentSession = (message: ChatMessage) => {
    if (!currentSession.value) return
    chatStore.addMessage(currentSession.value.id, message)
  }

  const updateMessageInCurrentSession = (messageId: string, updates: Partial<ChatMessage>) => {
    if (!currentSession.value) return
    chatStore.updateMessage(currentSession.value.id, messageId, updates)
  }

  const deleteMessageFromCurrentSession = (messageId: string) => {
    if (!currentSession.value) return
    chatStore.deleteMessage(currentSession.value.id, messageId)
  }

  // Search functionality
  const searchInCurrentSession = (query: string) => {
    if (!currentSession.value) return []

    return currentSessionMessages.value.filter(message =>
      message.content.toLowerCase().includes(query.toLowerCase())
    )
  }

  // Utility methods
  const clearCurrentSessionError = () => {
    chatStore.clearError()
  }

  const refreshCurrentSession = async () => {
    if (!currentSession.value) return
    await loadSession(currentSession.value.id)
  }

  return {
    // State
    currentSession,
    sessions,
    isLoading,
    error,
    currentSessionMessages,
    hasActiveSession,

    // Enhanced computed
    messageCount,
    lastMessage,
    unreadCount,
    sessionTitle,
    canSendMessage,
    isTyping,

    // Actions
    loadSessions,
    loadSession,
    createNewSession,
    switchSession,
    closeCurrentSession,
    deleteCurrentSession,
    updateCurrentSession,

    // Message management
    addMessageToCurrentSession,
    updateMessageInCurrentSession,
    deleteMessageFromCurrentSession,

    // Search
    searchInCurrentSession,

    // Utilities
    clearCurrentSessionError,
    refreshCurrentSession
  }
}
