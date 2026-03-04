import { ref, onMounted, onUnmounted } from 'vue'
import type { CollaborativeOptions } from '../types'

interface CollaborationUser {
  id: string
  name: string
  color: string
  cursor?: { x: number; y: number }
}

interface CollaborationState {
  users: CollaborationUser[]
  content: string
  version: number
}

export function useCollaborativeEditor(options: CollaborativeOptions) {
  const isConnected = ref(false)
  const users = ref<CollaborationUser[]>([])
  const currentUser = ref<CollaborationUser | null>(null)
  const content = ref('')
  const version = ref(0)
  const error = ref<string | null>(null)
  let provider: any = null

  const connect = async (roomId: string, userName: string) => {
    if (!options.enabled) return

    try {
      if (options.provider === 'yjs') {
        const Y = await import('yjs')
        const { WebrtcProvider } = await import('y-webrtc')

        const ydoc = new Y.Doc()
        provider = new WebrtcProvider(roomId, ydoc)

        const ytext = ydoc.getText('content')

        provider.on('status', (event: { connected: boolean }) => {
          isConnected.value = event.connected
        })

        ytext.observe(() => {
          content.value = ytext.toString()
          version.value++
        })

        currentUser.value = {
          id: generateUserId(),
          name: userName,
          color: generateUserColor()
        }
      } else if (options.provider === 'socketio') {
        const { io } = await import('socket.io-client')
        provider = io(options.roomId || roomId)

        provider.on('connect', () => {
          isConnected.value = true
        })

        provider.on('disconnect', () => {
          isConnected.value = false
        })

        provider.on('users', (userList: CollaborationUser[]) => {
          users.value = userList
        })

        provider.on('content', (data: { content: string; version: number }) => {
          content.value = data.content
          version.value = data.version
        })

        provider.emit('join', { roomId, userName })
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to connect'
    }
  }

  const disconnect = () => {
    if (provider) {
      if (options.provider === 'yjs') {
        provider.destroy()
      } else if (options.provider === 'socketio') {
        provider.disconnect()
      }
      provider = null
    }
    isConnected.value = false
    users.value = []
  }

  const updateContent = (newContent: string) => {
    content.value = newContent
    version.value++

    if (provider) {
      if (options.provider === 'socketio') {
        provider.emit('update', { content: newContent, version: version.value })
      }
    }
  }

  const updateCursor = (x: number, y: number) => {
    if (currentUser.value && provider) {
      currentUser.value.cursor = { x, y }

      if (options.provider === 'socketio') {
        provider.emit('cursor', { userId: currentUser.value.id, x, y })
      }
    }
  }

  const sendAwareness = (data: Record<string, unknown>) => {
    if (provider && options.provider === 'yjs') {
      provider.awareness.setLocalStateField('user', data)
    }
  }

  onMounted(() => {
    if (options.roomId && options.enabled) {
      connect(options.roomId, 'Anonymous')
    }
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    users,
    currentUser,
    content,
    version,
    error,
    connect,
    disconnect,
    updateContent,
    updateCursor,
    sendAwareness
  }
}

function generateUserId(): string {
  return Math.random().toString(36).substring(2, 15)
}

function generateUserColor(): string {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
