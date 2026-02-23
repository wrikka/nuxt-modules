import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { CollaborativeSession, Participant, TypingIndicator } from '../../types/domain'

export function useCollaborativeChat(sessionId: string) {
  const collaborativeSession = ref<CollaborativeSession | null>(null)
  const participants = ref<Participant[]>([])
  const typingIndicators = ref<TypingIndicator[]>([])
  const isConnected = ref(false)
  const socket = ref<WebSocket | null>(null)

  const activeParticipants = computed(() =>
    participants.value.filter(p => p.isActive)
  )

  const onlineParticipants = computed(() =>
    participants.value.filter(p => p.isOnline)
  )

  const typingUsers = computed(() => {
    const currentSessionTyping = typingIndicators.value.filter(
      indicator => indicator.sessionId === sessionId
    )
    return currentSessionTyping.map(indicator => indicator.userName)
  })

  function connectWebSocket() {
    if (socket.value?.readyState === WebSocket.OPEN) return

    socket.value = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/chat/${sessionId}`)

    socket.value.onopen = () => {
      isConnected.value = true
      console.log('Connected to collaborative chat')
    }

    socket.value.onmessage = (event) => {
      const data = JSON.parse(event.data)
      handleWebSocketMessage(data)
    }

    socket.value.onclose = () => {
      isConnected.value = false
      console.log('Disconnected from collaborative chat')

      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (!isConnected.value) {
          connectWebSocket()
        }
      }, 3000)
    }

    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error)
      isConnected.value = false
    }
  }

  function handleWebSocketMessage(data: any) {
    switch (data.type) {
      case 'session_update':
        collaborativeSession.value = data.session
        participants.value = data.session.participants
        break

      case 'participant_joined':
        const newParticipant: Participant = data.participant
        const existingIndex = participants.value.findIndex(p => p.id === newParticipant.id)

        if (existingIndex === -1) {
          participants.value.push(newParticipant)
        } else {
          participants.value[existingIndex] = newParticipant
        }
        break

      case 'participant_left':
        participants.value = participants.value.filter(p => p.id !== data.participantId)
        break

      case 'typing_start':
        const typingStartIndex = typingIndicators.value.findIndex(
          indicator => indicator.userId === data.userId && indicator.sessionId === data.sessionId
        )

        if (typingStartIndex === -1) {
          typingIndicators.value.push({
            userId: data.userId,
            userName: data.userName,
            sessionId: data.sessionId,
            timestamp: new Date()
          })
        } else {
          typingIndicators.value[typingStartIndex].timestamp = new Date()
        }
        break

      case 'typing_stop':
        typingIndicators.value = typingIndicators.value.filter(
          indicator => !(indicator.userId === data.userId && indicator.sessionId === data.sessionId)
        )
        break

      case 'cursor_update':
        const cursorIndex = participants.value.findIndex(p => p.id === data.userId)
        if (cursorIndex !== -1) {
          participants.value[cursorIndex].cursor = data.cursor
        }
        break

      case 'message_update':
        // Handle real-time message updates
        break
    }
  }

  function joinSession(userId: string, userName: string) {
    if (!socket.value || socket.value.readyState !== WebSocket.OPEN) return

    socket.value.send(JSON.stringify({
      type: 'join_session',
      data: {
        sessionId,
        userId,
        userName
      }
    }))
  }

  function leaveSession(userId: string) {
    if (!socket.value || socket.value.readyState !== WebSocket.OPEN) return

    socket.value.send(JSON.stringify({
      type: 'leave_session',
      data: {
        sessionId,
        userId
      }
    }))
  }

  function sendTypingStart(userId: string, userName: string) {
    if (!socket.value || socket.value.readyState !== WebSocket.OPEN) return

    socket.value.send(JSON.stringify({
      type: 'typing_start',
      data: {
        sessionId,
        userId,
        userName
      }
    }))
  }

  function sendTypingStop(userId: string) {
    if (!socket.value || socket.value.readyState !== WebSocket.OPEN) return

    socket.value.send(JSON.stringify({
      type: 'typing_stop',
      data: {
        sessionId,
        userId
      }
    }))
  }

  function sendCursorUpdate(userId: string, cursor: { line: number; position: number }) {
    if (!socket.value || socket.value.readyState !== WebSocket.OPEN) return

    socket.value.send(JSON.stringify({
      type: 'cursor_update',
      data: {
        sessionId,
        userId,
        cursor
      }
    }))
  }

  function broadcastMessage(message: any) {
    if (!socket.value || socket.value.readyState !== WebSocket.OPEN) return

    socket.value.send(JSON.stringify({
      type: 'message',
      data: {
        sessionId,
        message
      }
    }))
  }

  function disconnect() {
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
    isConnected.value = false
  }

  // Clean up old typing indicators (older than 5 seconds)
  function cleanupTypingIndicators() {
    const now = new Date()
    const fiveSecondsAgo = new Date(now.getTime() - 5000)

    typingIndicators.value = typingIndicators.value.filter(
      indicator => indicator.timestamp > fiveSecondsAgo
    )
  }

  onMounted(() => {
    connectWebSocket()

    // Set up cleanup interval
    const cleanupInterval = setInterval(cleanupTypingIndicators, 1000)

      // Store interval ID for cleanup
      ; (window as any)._typingCleanupInterval = cleanupInterval
  })

  onUnmounted(() => {
    disconnect()

    // Clear cleanup interval
    const intervalId = (window as any)._typingCleanupInterval
    if (intervalId) {
      clearInterval(intervalId)
      delete (window as any)._typingCleanupInterval
    }
  })

  return {
    // State
    collaborativeSession,
    participants,
    typingIndicators,
    isConnected,
    activeParticipants,
    onlineParticipants,
    typingUsers,

    // Actions
    connectWebSocket,
    joinSession,
    leaveSession,
    sendTypingStart,
    sendTypingStop,
    sendCursorUpdate,
    broadcastMessage,
    disconnect
  }
}
