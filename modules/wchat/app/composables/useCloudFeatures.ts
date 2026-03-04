import type {
  Message,
  Chat,
  CloudDraft,
  SavedMessage,
  ChatFolder,
  ScheduledMessage,
  MediaFile,
  MessageType,
  MessageStatus,
  ChatType
} from '../types'

export const useCloudMessages = () => {
  const config = useRuntimeConfig()
  const { $ws } = useNuxtApp()

  const messages = ref<Map<string, Message[]>>(new Map())
  const isSyncing = ref(false)
  const lastSyncAt = ref<Date | null>(null)

  // Feature 1: Cloud-Based Messages - Sync across devices
  const syncMessages = async (chatId: string, since?: Date) => {
    if (!config.public.wchat.enableCloudSync) return

    isSyncing.value = true
    try {
      const { data } = await $fetch(`/api/chat/sync`, {
        method: 'POST',
        body: { chatId, since: since?.toISOString() }
      })

      if (data?.messages) {
        const current = messages.value.get(chatId) || []
        const merged = mergeMessages(current, data.messages)
        messages.value.set(chatId, merged)
        lastSyncAt.value = new Date()
      }
    } finally {
      isSyncing.value = false
    }
  }

  const mergeMessages = (local: Message[], remote: Message[]): Message[] => {
    const map = new Map<string, Message>()
    ;[...local, ...remote].forEach(msg => {
      const existing = map.get(msg.id)
      if (!existing || new Date(msg.updatedAt) > new Date(existing.updatedAt)) {
        map.set(msg.id, msg)
      }
    })
    return Array.from(map.values()).sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  }

  // WebSocket listener for real-time sync
  onMounted(() => {
    $ws?.on('message', (data: Message) => {
      const chatMessages = messages.value.get(data.chatId) || []
      const exists = chatMessages.find(m => m.id === data.id)
      if (!exists) {
        chatMessages.push(data)
        messages.value.set(data.chatId, chatMessages)
      }
    })

    $ws?.on('message_edit', (data: { id: string; chatId: string; content: string; editedAt: Date }) => {
      const chatMessages = messages.value.get(data.chatId) || []
      const msg = chatMessages.find(m => m.id === data.id)
      if (msg) {
        msg.content = data.content
        msg.isEdited = true
        msg.editedAt = data.editedAt
      }
    })

    $ws?.on('message_delete', (data: { id: string; chatId: string }) => {
      const chatMessages = messages.value.get(data.chatId) || []
      const index = chatMessages.findIndex(m => m.id === data.id)
      if (index > -1) {
        chatMessages.splice(index, 1)
      }
    })
  })

  return {
    messages: computed(() => messages.value),
    isSyncing: readonly(isSyncing),
    lastSyncAt: readonly(lastSyncAt),
    syncMessages
  }
}

// Feature 5: Cloud Drafts - Sync typing across devices
export const useCloudDrafts = () => {
  const config = useRuntimeConfig()
  const drafts = ref<Map<string, CloudDraft>>(new Map())

  const saveDraft = async (chatId: string, content: string, replyTo?: string) => {
    if (!config.public.wchat.enableCloudSync) {
      // Local only
      drafts.value.set(chatId, {
        id: `local-${chatId}`,
        chatId,
        userId: '',
        content,
        replyTo,
        updatedAt: new Date(),
        deviceId: 'local'
      })
      return
    }

    const draft: CloudDraft = {
      id: `${chatId}-${Date.now()}`,
      chatId,
      userId: '',
      content,
      replyTo,
      updatedAt: new Date(),
      deviceId: navigator.userAgent
    }

    drafts.value.set(chatId, draft)

    await $fetch('/api/chat/drafts', {
      method: 'POST',
      body: draft
    })
  }

  const getDraft = (chatId: string): CloudDraft | undefined => {
    return drafts.value.get(chatId)
  }

  const clearDraft = async (chatId: string) => {
    drafts.value.delete(chatId)
    await $fetch(`/api/chat/drafts/${chatId}`, { method: 'DELETE' })
  }

  return {
    drafts: computed(() => drafts.value),
    saveDraft,
    getDraft,
    clearDraft
  }
}

// Feature 7: Saved Messages - Personal bookmark chat
export const useSavedMessages = () => {
  const savedMessages = ref<SavedMessage[]>([])

  const saveMessage = async (message: Message, folder?: string, tags?: string[]) => {
    const saved: SavedMessage = {
      id: `saved-${message.id}`,
      userId: '',
      messageId: message.id,
      message,
      folder: folder || 'General',
      tags: tags || [],
      createdAt: new Date()
    }

    savedMessages.value.push(saved)

    await $fetch('/api/chat/saved', {
      method: 'POST',
      body: saved
    })
  }

  const unsaveMessage = async (messageId: string) => {
    const index = savedMessages.value.findIndex(s => s.messageId === messageId)
    if (index > -1) {
      savedMessages.value.splice(index, 1)
      await $fetch(`/api/chat/saved/${messageId}`, { method: 'DELETE' })
    }
  }

  const getSavedByFolder = (folder: string): SavedMessage[] => {
    return savedMessages.value.filter(s => s.folder === folder)
  }

  const getSavedByTag = (tag: string): SavedMessage[] => {
    return savedMessages.value.filter(s => s.tags.includes(tag))
  }

  return {
    savedMessages: computed(() => savedMessages.value),
    saveMessage,
    unsaveMessage,
    getSavedByFolder,
    getSavedByTag
  }
}

// Feature 8: Chat Folders
export const useChatFolders = () => {
  const folders = ref<ChatFolder[]>([])
  const activeFolder = ref<string | null>(null)

  const createFolder = async (title: string, icon?: string): Promise<ChatFolder> => {
    const folder: ChatFolder = {
      id: `folder-${Date.now()}`,
      userId: '',
      title,
      icon,
      iconColor: getRandomColor(),
      includedChats: [],
      excludedChats: [],
      includeMuted: false,
      includeRead: true,
      includeArchived: false,
      chatTypes: [],
      isDefault: false,
      order: folders.value.length,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    folders.value.push(folder)
    await $fetch('/api/chat/folders', { method: 'POST', body: folder })
    return folder
  }

  const addChatToFolder = async (folderId: string, chatId: string) => {
    const folder = folders.value.find(f => f.id === folderId)
    if (folder && !folder.includedChats.includes(chatId)) {
      folder.includedChats.push(chatId)
      folder.updatedAt = new Date()
      await $fetch(`/api/chat/folders/${folderId}`, { method: 'PUT', body: folder })
    }
  }

  const removeChatFromFolder = async (folderId: string, chatId: string) => {
    const folder = folders.value.find(f => f.id === folderId)
    if (folder) {
      folder.includedChats = folder.includedChats.filter(id => id !== chatId)
      folder.updatedAt = new Date()
      await $fetch(`/api/chat/folders/${folderId}`, { method: 'PUT', body: folder })
    }
  }

  const getChatsInFolder = (folderId: string): string[] => {
    const folder = folders.value.find(f => f.id === folderId)
    return folder?.includedChats || []
  }

  const setActiveFolder = (folderId: string | null) => {
    activeFolder.value = folderId
  }

  const getRandomColor = (): string => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return {
    folders: computed(() => folders.value),
    activeFolder: readonly(activeFolder),
    createFolder,
    addChatToFolder,
    removeChatFromFolder,
    getChatsInFolder,
    setActiveFolder
  }
}

// Feature 6: Message Scheduling
export const useMessageScheduling = () => {
  const scheduledMessages = ref<ScheduledMessage[]>([])

  const scheduleMessage = async (
    chatId: string,
    content: string,
    scheduledAt: Date,
    sendWhenOnline?: boolean,
    media?: MediaFile[]
  ): Promise<ScheduledMessage> => {
    const scheduled: ScheduledMessage = {
      id: `scheduled-${Date.now()}`,
      chatId,
      senderId: '',
      content,
      media,
      scheduledAt,
      sendWhenOnline,
      isSent: false,
      createdAt: new Date()
    }

    scheduledMessages.value.push(scheduled)
    await $fetch('/api/chat/scheduled', { method: 'POST', body: scheduled })
    return scheduled
  }

  const cancelScheduled = async (id: string) => {
    const index = scheduledMessages.value.findIndex(s => s.id === id)
    if (index > -1 && !scheduledMessages.value[index].isSent) {
      scheduledMessages.value.splice(index, 1)
      await $fetch(`/api/chat/scheduled/${id}`, { method: 'DELETE' })
    }
  }

  const getScheduledForChat = (chatId: string): ScheduledMessage[] => {
    return scheduledMessages.value.filter(s => s.chatId === chatId && !s.isSent)
  }

  return {
    scheduledMessages: computed(() => scheduledMessages.value),
    scheduleMessage,
    cancelScheduled,
    getScheduledForChat
  }
}
