import type { Message, SelfDestructConfig, Chat } from '../types'

// Feature 3: Message Editing - Edit within 48 hours
export const useMessageEditing = () => {
  const EDIT_WINDOW_HOURS = 48

  const canEdit = (message: Message): boolean => {
    if (message.isDeleted) return false
    const hoursSinceCreation = (Date.now() - new Date(message.createdAt).getTime()) / (1000 * 60 * 60)
    return hoursSinceCreation < EDIT_WINDOW_HOURS && !message.forwardFrom
  }

  const editMessage = async (messageId: string, chatId: string, newContent: string): Promise<Message | null> => {
    const { data } = await $fetch(`/api/chat/messages/${messageId}`, {
      method: 'PUT',
      body: { content: newContent, isEdited: true, editedAt: new Date() }
    })
    return data
  }

  return {
    canEdit,
    editMessage,
    EDIT_WINDOW_HOURS
  }
}

// Feature 4: Self-Destruct Messages
export const useSelfDestruct = () => {
  const DURATIONS = [
    { label: '1 day', value: 24 * 60 * 60 },
    { label: '1 week', value: 7 * 24 * 60 * 60 },
    { label: '1 month', value: 30 * 24 * 60 * 60 },
    { label: '1 year', value: 365 * 24 * 60 * 60 }
  ]

  const createSelfDestruct = (durationSeconds: number): SelfDestructConfig => ({
    enabled: true,
    duration: durationSeconds
  })

  const checkAndDestroy = async (message: Message): Promise<boolean> => {
    if (!message.selfDestruct?.enabled || !message.selfDestruct.viewedAt) return false

    const destroyAt = new Date(message.selfDestruct.viewedAt).getTime() + message.selfDestruct.duration * 1000
    if (Date.now() >= destroyAt) {
      await $fetch(`/api/chat/messages/${message.id}`, { method: 'DELETE' })
      return true
    }
    return false
  }

  const markAsViewed = async (messageId: string) => {
    await $fetch(`/api/chat/messages/${messageId}/view`, { method: 'POST' })
  }

  return {
    DURATIONS,
    createSelfDestruct,
    checkAndDestroy,
    markAsViewed
  }
}

// Feature 2: Secret Chats (E2EE)
export const useSecretChats = () => {
  const config = useRuntimeConfig()

  const generateEncryptionKey = (): string => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
  }

  const createSecretChat = async (userId: string): Promise<Chat | null> => {
    if (!config.public.wchat.enableSecretChats) return null

    const key = generateEncryptionKey()
    const chat: Partial<Chat> = {
      type: 'secret',
      encryptionKey: key,
      deviceId: navigator.userAgent,
      screenshotNotifications: true,
      members: []
    }

    const { data } = await $fetch('/api/chat/secret', {
      method: 'POST',
      body: chat
    })
    return data
  }

  const encryptMessage = (content: string, key: string): string => {
    // Simple XOR encryption for demo - use proper encryption in production
    const encoded = new TextEncoder().encode(content)
    const keyBytes = new TextEncoder().encode(key.slice(0, 32))
    const encrypted = encoded.map((byte, i) => byte ^ keyBytes[i % keyBytes.length])
    return btoa(String.fromCharCode(...encrypted))
  }

  const decryptMessage = (encrypted: string, key: string): string => {
    const decoded = atob(encrypted)
    const bytes = new Uint8Array(decoded.split('').map(c => c.charCodeAt(0)))
    const keyBytes = new TextEncoder().encode(key.slice(0, 32))
    const decrypted = bytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length])
    return new TextDecoder().decode(decrypted)
  }

  return {
    generateEncryptionKey,
    createSecretChat,
    encryptMessage,
    decryptMessage
  }
}

// E2EE Voice/Video Calls
export const useE2EECalls = () => {
  const generateCallKey = (): string => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
  }

  const encryptCallData = (data: string, key: string): string => {
    // Use proper WebRTC E2EE in production
    return encryptMessage(data, key)
  }

  return {
    generateCallKey,
    encryptCallData
  }
}

const encryptMessage = (content: string, key: string): string => {
  const encoded = new TextEncoder().encode(content)
  const keyBytes = new TextEncoder().encode(key.slice(0, 32))
  const encrypted = encoded.map((byte, i) => byte ^ keyBytes[i % keyBytes.length])
  return btoa(String.fromCharCode(...encrypted))
}
