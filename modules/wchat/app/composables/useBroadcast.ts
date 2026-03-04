import type { BroadcastList, BroadcastMessage } from '../types'

// Broadcast Lists - Send to multiple contacts without creating group
export const useBroadcastLists = () => {
  const config = useRuntimeConfig()
  const lists = ref<BroadcastList[]>([])
  const isLoading = ref(false)

  // Load broadcast lists
  const loadLists = async (): Promise<void> => {
    if (!config.public.wchat?.enableBroadcast) return

    isLoading.value = true
    try {
      const data = await $fetch<BroadcastList[]>('/api/chat/broadcast')
      lists.value = data
    } finally {
      isLoading.value = false
    }
  }

  // Create broadcast list
  const createList = async (
    name: string,
    recipientIds: string[]
  ): Promise<BroadcastList | null> => {
    if (!config.public.wchat?.enableBroadcast) return null

    const list = await $fetch<BroadcastList>('/api/chat/broadcast', {
      method: 'POST',
      body: { name, recipientIds }
    })

    lists.value.push(list)
    return list
  }

  // Update list
  const updateList = async (
    listId: string,
    updates: Partial<BroadcastList>
  ): Promise<BroadcastList | null> => {
    const list = await $fetch<BroadcastList>(`/api/chat/broadcast/${listId}`, {
      method: 'PUT',
      body: updates
    })

    const index = lists.value.findIndex(l => l.id === listId)
    if (index >= 0) {
      lists.value[index] = list
    }

    return list
  }

  // Delete list
  const deleteList = async (listId: string): Promise<void> => {
    await $fetch(`/api/chat/broadcast/${listId}`, { method: 'DELETE' })
    lists.value = lists.value.filter(l => l.id !== listId)
  }

  // Send broadcast message
  const sendBroadcast = async (
    listId: string,
    content: string,
    options?: {
      media?: any[]
      schedule?: Date
    }
  ): Promise<BroadcastMessage | null> => {
    if (!config.public.wchat?.enableBroadcast) return null

    return await $fetch<BroadcastMessage>(`/api/chat/broadcast/${listId}/send`, {
      method: 'POST',
      body: { content, ...options }
    })
  }

  // Get broadcast stats
  const getStats = async (listId: string): Promise<{
    total: number
    sent: number
    delivered: number
    read: number
    failed: number
  }> => {
    return await $fetch(`/api/chat/broadcast/${listId}/stats`)
  }

  return {
    lists: readonly(lists),
    isLoading: readonly(isLoading),
    loadLists,
    createList,
    updateList,
    deleteList,
    sendBroadcast,
    getStats
  }
}

// Message Pin to Top
export const useMessagePin = () => {
  const config = useRuntimeConfig()
  const pinnedMessages = ref<Map<string, string>>(new Map()) // chatId -> messageId

  // Pin message to top of chat list
  const pinToTop = async (chatId: string): Promise<void> => {
    await $fetch(`/api/chat/chats/${chatId}/pin`, { method: 'POST' })
    pinnedMessages.value.set(chatId, chatId)
  }

  // Unpin from top
  const unpinFromTop = async (chatId: string): Promise<void> => {
    await $fetch(`/api/chat/chats/${chatId}/unpin`, { method: 'POST' })
    pinnedMessages.value.delete(chatId)
  }

  // Toggle pin
  const togglePin = async (chatId: string, isPinned: boolean): Promise<void> => {
    if (isPinned) {
      await unpinFromTop(chatId)
    } else {
      await pinToTop(chatId)
    }
  }

  return {
    pinnedMessages: readonly(pinnedMessages),
    pinToTop,
    unpinFromTop,
    togglePin
  }
}

// Read Receipts Control
export const useReadReceipts = () => {
  const config = useRuntimeConfig()
  const globalEnabled = useLocalStorage('wchat:read-receipts:global', true)
  const chatSettings = useLocalStorage<Record<string, boolean>>('wchat:read-receipts:chats', {})

  // Toggle global setting
  const toggleGlobal = async (enabled: boolean): Promise<void> => {
    globalEnabled.value = enabled
    await $fetch('/api/chat/settings/read-receipts', {
      method: 'PUT',
      body: { enabled }
    })
  }

  // Set per-chat
  const setChatSetting = async (
    chatId: string,
    enabled: boolean
  ): Promise<void> => {
    chatSettings.value[chatId] = enabled
    await $fetch(`/api/chat/chats/${chatId}/read-receipts`, {
      method: 'PUT',
      body: { enabled }
    })
  }

  // Check if enabled for chat
  const isEnabledForChat = (chatId: string): boolean => {
    if (!globalEnabled.value) return false
    return chatSettings.value[chatId] !== false
  }

  return {
    globalEnabled: readonly(globalEnabled),
    chatSettings: readonly(chatSettings),
    toggleGlobal,
    setChatSetting,
    isEnabledForChat
  }
}

// Chat Export (PDF/HTML)
export const useChatExport = () => {
  const config = useRuntimeConfig()
  const isExporting = ref(false)
  const exportProgress = ref(0)

  // Export to PDF
  const exportToPDF = async (
    chatId: string,
    options?: {
      includeMedia?: boolean
      dateRange?: { start: Date; end: Date }
    }
  ): Promise<Blob | null> => {
    if (!config.public.wchat?.enableExport) return null

    isExporting.value = true
    exportProgress.value = 0

    try {
      const blob = await $fetch<Blob>(`/api/chat/chats/${chatId}/export/pdf`, {
        method: 'POST',
        body: options,
        onDownloadProgress: (progress) => {
          exportProgress.value = progress.progress
        }
      })

      // Download
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `chat-export-${new Date().toISOString().split('T')[0]}.pdf`
      a.click()
      URL.revokeObjectURL(url)

      return blob
    } finally {
      isExporting.value = false
      exportProgress.value = 0
    }
  }

  // Export to HTML
  const exportToHTML = async (
    chatId: string,
    options?: {
      theme?: 'light' | 'dark'
      includeMedia?: boolean
    }
  ): Promise<string | null> => {
    if (!config.public.wchat?.enableExport) return null

    const html = await $fetch<string>(`/api/chat/chats/${chatId}/export/html`, {
      method: 'POST',
      body: options
    })

    // Download
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.html`
    a.click()
    URL.revokeObjectURL(url)

    return html
  }

  // Export to JSON
  const exportToJSON = async (chatId: string): Promise<object | null> => {
    if (!config.public.wchat?.enableExport) return null

    const data = await $fetch<object>(`/api/chat/chats/${chatId}/export/json`)

    // Download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    return data
  }

  return {
    isExporting: readonly(isExporting),
    exportProgress: readonly(exportProgress),
    exportToPDF,
    exportToHTML,
    exportToJSON
  }
}
