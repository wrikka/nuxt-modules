import { ref, computed } from 'vue'
import { chatApiService, ChatApiError } from '../services/api'
import type { ChatMessage, ChatSession } from '../types/domain'

export function useChatApi() {
  const isLoading = ref(false)
  const error = ref<ChatApiError | null>(null)

  const clearError = () => {
    error.value = null
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  // Message API methods
  const createMessage = async (sessionId: string, content: string, role: 'user' | 'assistant' | 'system' = 'user') => {
    setLoading(true)
    clearError()

    try {
      const response = await chatApiService.createMessage(sessionId, {
        content,
        role
      })
      return response.data
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateMessage = async (sessionId: string, messageId: string, updates: Partial<ChatMessage>) => {
    setLoading(true)
    clearError()

    try {
      const response = await chatApiService.updateMessage(sessionId, messageId, updates)
      return response.data
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteMessage = async (sessionId: string, messageId: string) => {
    setLoading(true)
    clearError()

    try {
      await chatApiService.deleteMessage(sessionId, messageId)
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getMessages = async (sessionId: string, page = 1, limit = 50) => {
    setLoading(true)
    clearError()

    try {
      const response = await chatApiService.getMessages(sessionId, page, limit)
      return response
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Session API methods
  const createSession = async (title: string, options?: { mode?: string; model?: string; systemPrompt?: string }) => {
    setLoading(true)
    clearError()

    try {
      const response = await chatApiService.createSession({
        title,
        ...options
      })
      return response.data
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateSession = async (sessionId: string, updates: Partial<ChatSession>) => {
    setLoading(true)
    clearError()

    try {
      const response = await chatApiService.updateSession(sessionId, updates)
      return response.data
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteSession = async (sessionId: string) => {
    setLoading(true)
    clearError()

    try {
      await chatApiService.deleteSession(sessionId)
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getSession = async (sessionId: string) => {
    setLoading(true)
    clearError()

    try {
      const response = await chatApiService.getSession(sessionId)
      return response.data
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getSessions = async (page = 1, limit = 20) => {
    setLoading(true)
    clearError()

    try {
      const response = await chatApiService.getSessions(page, limit)
      return response
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Search API methods
  const searchMessages = async (query: string, filters?: any) => {
    setLoading(true)
    clearError()

    try {
      const response = await chatApiService.searchMessages({
        query,
        filters
      })
      return response.data
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  // File upload methods
  const uploadFile = async (file: File, sessionId: string, type: 'avatar' | 'attachment' | 'voice' = 'attachment') => {
    setLoading(true)
    clearError()

    try {
      const response = await chatApiService.uploadFile({
        file,
        sessionId,
        type
      })
      return response.data
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Voice methods
  const uploadVoiceMessage = async (audioBlob: Blob, sessionId: string, duration: number) => {
    setLoading(true)
    clearError()

    try {
      const response = await chatApiService.uploadVoiceMessage({
        audioBlob,
        sessionId,
        duration
      })
      return response.data
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  const transcribeVoice = async (audioFile: File, language?: string) => {
    setLoading(true)
    clearError()

    try {
      const response = await chatApiService.transcribeVoice({
        audioFile,
        language
      })
      return response.data
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Reaction methods
  const addReaction = async (messageId: string, emoji: string, userId: string) => {
    setLoading(true)
    clearError()

    try {
      await chatApiService.addReaction(messageId, emoji, userId)
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeReaction = async (reactionId: string) => {
    setLoading(true)
    clearError()

    try {
      await chatApiService.removeReaction(reactionId)
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getReactions = async (messageId: string) => {
    setLoading(true)
    clearError()

    try {
      const response = await chatApiService.getReactions(messageId)
      return response.data
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Analytics methods
  const getAnalytics = async (options?: { sessionId?: string; dateRange?: { start: Date; end: Date } }) => {
    setLoading(true)
    clearError()

    try {
      const response = await chatApiService.getAnalytics(options || {})
      return response.data
    } catch (err) {
      error.value = err as ChatApiError
      throw err
    } finally {
      setLoading(false)
    }
  }

  // WebSocket connection
  const createWebSocketConnection = (sessionId: string) => {
    return chatApiService.createWebSocketConnection(sessionId)
  }

  // Authentication
  const setAuthToken = (token: string) => {
    chatApiService.setAuthToken(token)
  }

  const removeAuthToken = () => {
    chatApiService.removeAuthToken()
  }

  return {
    // State
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Actions
    clearError,

    // Message methods
    createMessage,
    updateMessage,
    deleteMessage,
    getMessages,

    // Session methods
    createSession,
    updateSession,
    deleteSession,
    getSession,
    getSessions,

    // Search methods
    searchMessages,

    // File methods
    uploadFile,

    // Voice methods
    uploadVoiceMessage,
    transcribeVoice,

    // Reaction methods
    addReaction,
    removeReaction,
    getReactions,

    // Analytics methods
    getAnalytics,

    // WebSocket
    createWebSocketConnection,

    // Authentication
    setAuthToken,
    removeAuthToken
  }
}
