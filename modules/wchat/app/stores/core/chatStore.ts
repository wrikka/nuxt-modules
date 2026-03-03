import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { ChatSession, ChatMessage, ChatState } from '../../types'

export const useChatStore = defineStore('chat', () => {
  // State
  const currentSession = ref<ChatSession | null>(null)
  const sessions = ref<ChatSession[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const currentSessionMessages = computed(() =>
    currentSession.value?.messages || []
  )

  const hasActiveSession = computed(() =>
    currentSession.value !== null
  )

  // Actions
  function setCurrentSession(session: ChatSession | null) {
    currentSession.value = session
  }

  function addSession(session: ChatSession) {
    sessions.value.unshift(session)
    setCurrentSession(session)
  }

  function updateSession(sessionId: string, updates: Partial<ChatSession>) {
    const index = sessions.value.findIndex((s: ChatSession) => s.id === sessionId)
    if (index !== -1) {
      sessions.value[index] = {
        ...sessions.value[index],
        ...updates,
        updatedAt: new Date()
      }

      // Update current session if it's the one being updated
      if (currentSession.value?.id === sessionId) {
        currentSession.value = sessions.value[index]
      }
    }
  }

  function deleteSession(sessionId: string) {
    sessions.value = sessions.value.filter((s: ChatSession) => s.id !== sessionId)

    // Clear current session if it was deleted
    if (currentSession.value?.id === sessionId) {
      currentSession.value = null
    }
  }

  function addMessage(sessionId: string, message: ChatMessage) {
    const session = sessions.value.find((s: ChatSession) => s.id === sessionId)
    if (session) {
      session.messages.push(message)
      session.updatedAt = new Date()

      // Update current session if it's the one receiving the message
      if (currentSession.value?.id === sessionId) {
        currentSession.value = session
      }
    }
  }

  function updateMessage(sessionId: string, messageId: string, updates: Partial<ChatMessage>) {
    const session = sessions.value.find((s: ChatSession) => s.id === sessionId)
    if (session) {
      const messageIndex = session.messages.findIndex((m: ChatMessage) => m.id === messageId)
      if (messageIndex !== -1) {
        session.messages[messageIndex] = { ...session.messages[messageIndex], ...updates }
        session.updatedAt = new Date()

        // Update current session if it's the one being updated
        if (currentSession.value?.id === sessionId) {
          currentSession.value = session
        }
      }
    }
  }

  function deleteMessage(sessionId: string, messageId: string) {
    const session = sessions.value.find((s: ChatSession) => s.id === sessionId)
    if (session) {
      session.messages = session.messages.filter((m: ChatMessage) => m.id !== messageId)
      session.updatedAt = new Date()

      // Update current session if it's the one being updated
      if (currentSession.value?.id === sessionId) {
        currentSession.value = session
      }
    }
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(err: string | null) {
    error.value = err
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    currentSession: readonly(currentSession),
    sessions: readonly(sessions),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Getters
    currentSessionMessages,
    hasActiveSession,

    // Actions
    setCurrentSession,
    addSession,
    updateSession,
    deleteSession,
    addMessage,
    updateMessage,
    deleteMessage,
    setLoading,
    setError,
    clearError
  }
})
