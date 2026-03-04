import type { SearchFilters, SearchResult, PrivacySettings, TwoStepVerification, ActiveSession, NotificationSettings } from '../types'

// Feature 25: Search with Advanced Filters
export const useSearch = () => {
  const isSearching = ref(false)
  const lastResults = ref<SearchResult | null>(null)
  const searchHistory = useLocalStorage<string[]>('wchat-search-history', [])

  const search = async (filters: SearchFilters): Promise<SearchResult> => {
    isSearching.value = true

    try {
      const { data } = await $fetch('/api/chat/search', {
        method: 'POST',
        body: filters
      })

      if (filters.query && !searchHistory.value.includes(filters.query)) {
        searchHistory.value = [filters.query, ...searchHistory.value].slice(0, 10)
      }

      lastResults.value = data
      return data || { messages: [], chats: [], totalCount: 0 }
    } finally {
      isSearching.value = false
    }
  }

  const searchInChat = async (chatId: string, query: string, type?: string): Promise<SearchResult> => {
    return search({ chatId, query, types: type ? [type as any] : undefined })
  }

  const searchByDate = async (dateFrom: Date, dateTo: Date, chatId?: string): Promise<SearchResult> => {
    return search({ dateFrom, dateTo, chatId })
  }

  const searchMedia = async (chatId?: string): Promise<SearchResult> => {
    return search({ chatId, hasMedia: true })
  }

  const searchLinks = async (chatId?: string): Promise<SearchResult> => {
    return search({ chatId, hasLinks: true })
  }

  const clearHistory = () => {
    searchHistory.value = []
  }

  return {
    isSearching: readonly(isSearching),
    lastResults: readonly(lastResults),
    searchHistory: readonly(searchHistory),
    search,
    searchInChat,
    searchByDate,
    searchMedia,
    searchLinks,
    clearHistory
  }
}

// Feature 41-48: Privacy & Security
export const usePrivacy = () => {
  const settings = ref<PrivacySettings | null>(null)
  const activeSessions = ref<ActiveSession[]>([])
  const twoStep = ref<TwoStepVerification | null>(null)

  // Load privacy settings
  const loadSettings = async (): Promise<PrivacySettings | null> => {
    const { data } = await $fetch('/api/chat/privacy')
    settings.value = data
    return data
  }

  // Update privacy setting
  const updateSetting = async <K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K]
  ): Promise<void> => {
    await $fetch('/api/chat/privacy', {
      method: 'PUT',
      body: { [key]: value }
    })

    if (settings.value) {
      settings.value[key] = value
    }
  }

  // Block user
  const blockUser = async (userId: string): Promise<void> => {
    await $fetch(`/api/chat/blocked/${userId}`, { method: 'POST' })
    if (settings.value && !settings.value.blockedUsers.includes(userId)) {
      settings.value.blockedUsers.push(userId)
    }
  }

  // Unblock user
  const unblockUser = async (userId: string): Promise<void> => {
    await $fetch(`/api/chat/blocked/${userId}`, { method: 'DELETE' })
    if (settings.value) {
      settings.value.blockedUsers = settings.value.blockedUsers.filter(id => id !== userId)
    }
  }

  // Load active sessions
  const loadSessions = async (): Promise<ActiveSession[]> => {
    const { data } = await $fetch('/api/chat/sessions')
    activeSessions.value = data || []
    return data || []
  }

  // Terminate session (Feature 46: Remote Logout)
  const terminateSession = async (sessionId: string): Promise<void> => {
    await $fetch(`/api/chat/sessions/${sessionId}`, { method: 'DELETE' })
    activeSessions.value = activeSessions.value.filter(s => s.id !== sessionId)
  }

  // Terminate all other sessions
  const terminateOtherSessions = async (): Promise<void> => {
    await $fetch('/api/chat/sessions/others', { method: 'DELETE' })
    await loadSessions()
  }

  // Two-Step Verification (Feature 41)
  const enable2FA = async (password: string, hint?: string, email?: string): Promise<void> => {
    await $fetch('/api/chat/2fa', {
      method: 'POST',
      body: { password, hint, email }
    })

    if (twoStep.value) {
      twoStep.value.isEnabled = true
      twoStep.value.passwordHint = hint
      twoStep.value.recoveryEmail = email
    }
  }

  const disable2FA = async (password: string): Promise<void> => {
    await $fetch('/api/chat/2fa', {
      method: 'DELETE',
      body: { password }
    })

    if (twoStep.value) {
      twoStep.value.isEnabled = false
    }
  }

  const verify2FA = async (password: string): Promise<boolean> => {
    const { data } = await $fetch('/api/chat/2fa/verify', {
      method: 'POST',
      body: { password }
    })
    return data?.valid || false
  }

  return {
    settings: readonly(settings),
    activeSessions: readonly(activeSessions),
    twoStep: readonly(twoStep),
    loadSettings,
    updateSetting,
    blockUser,
    unblockUser,
    loadSessions,
    terminateSession,
    terminateOtherSessions,
    enable2FA,
    disable2FA,
    verify2FA
  }
}

// Feature 30: Notifications
export const useNotifications = () => {
  const settings = ref<Map<string, NotificationSettings>>(new Map())
  const isSupported = computed(() => 'Notification' in window)

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported.value) return false

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  const updateSettings = async (chatId: string, updates: Partial<NotificationSettings>): Promise<void> => {
    await $fetch(`/api/chat/notifications/${chatId}`, {
      method: 'PUT',
      body: updates
    })

    const current = settings.value.get(chatId)
    if (current) {
      settings.value.set(chatId, { ...current, ...updates })
    }
  }

  const muteChat = async (chatId: string, hours?: number): Promise<void> => {
    const until = hours ? new Date(Date.now() + hours * 60 * 60 * 1000) : undefined
    await updateSettings(chatId, {
      isMuted: true,
      muteUntil: until
    })
  }

  const unmuteChat = async (chatId: string): Promise<void> => {
    await updateSettings(chatId, {
      isMuted: false,
      muteUntil: undefined
    })
  }

  const showNotification = (title: string, options?: NotificationOptions): void => {
    if (!isSupported.value || Notification.permission !== 'granted') return

    new Notification(title, {
      icon: '/chat-icon.png',
      badge: '/chat-badge.png',
      ...options
    })
  }

  return {
    settings: computed(() => settings.value),
    isSupported,
    requestPermission,
    updateSettings,
    muteChat,
    unmuteChat,
    showNotification
  }
}

// Feature 22: Message Reactions
export const useReactions = () => {
  const config = useRuntimeConfig()
  const recentReactions = useLocalStorage<string[]>('wchat-recent-reactions', ['👍', '❤️', '😂', '😮', '😢', '😡'])

  const AVAILABLE_REACTIONS = [
    '👍', '❤️', '🔥', '🎉', '🤩', '👏',
    '😂', '😭', '😡', '😮', '🤔', '👎',
    '🙏', '🤝', '🫡', '🎊', '🤯', '🤬'
  ]

  const addReaction = async (messageId: string, emoji: string, isAnimated: boolean = false): Promise<void> => {
    if (!config.public.wchat.enableReactions) return

    await $fetch(`/api/chat/messages/${messageId}/reactions`, {
      method: 'POST',
      body: { emoji, isAnimated }
    })

    if (!recentReactions.value.includes(emoji)) {
      recentReactions.value = [emoji, ...recentReactions.value].slice(0, 10)
    }
  }

  const removeReaction = async (messageId: string, emoji: string): Promise<void> => {
    await $fetch(`/api/chat/messages/${messageId}/reactions`, {
      method: 'DELETE',
      body: { emoji }
    })
  }

  const toggleReaction = async (messageId: string, emoji: string): Promise<void> => {
    // Check if already reacted
    const { data } = await $fetch(`/api/chat/messages/${messageId}/reactions/check`, {
      params: { emoji }
    })

    if (data?.hasReacted) {
      await removeReaction(messageId, emoji)
    } else {
      await addReaction(messageId, emoji)
    }
  }

  return {
    availableReactions: AVAILABLE_REACTIONS,
    recentReactions: readonly(recentReactions),
    addReaction,
    removeReaction,
    toggleReaction
  }
}

// Feature 24: Import/Export
export const useImportExport = () => {
  const exportProgress = ref(0)
  const importProgress = ref(0)

  const exportChat = async (chatId: string, format: 'json' | 'html' | 'pdf'): Promise<string | null> => {
    exportProgress.value = 0

    const { data } = await $fetch(`/api/chat/export`, {
      method: 'POST',
      body: { chatId, format },
      onDownloadProgress: (progress) => {
        exportProgress.value = Math.round((progress.loaded / progress.total) * 100)
      }
    })

    exportProgress.value = 100
    return data?.downloadUrl
  }

  const importChat = async (
    source: 'whatsapp' | 'line' | 'kakaotalk',
    file: File
  ): Promise<{ success: boolean; errors: string[] }> => {
    importProgress.value = 0

    const formData = new FormData()
    formData.append('file', file)
    formData.append('source', source)

    const { data } = await $fetch('/api/chat/import', {
      method: 'POST',
      body: formData,
      onUploadProgress: (progress) => {
        importProgress.value = Math.round((progress.loaded / progress.total) * 100)
      }
    })

    return data || { success: false, errors: [] }
  }

  return {
    exportProgress: readonly(exportProgress),
    importProgress: readonly(importProgress),
    exportChat,
    importChat
  }
}

// Feature 29: Pin Messages
export const usePinnedMessages = () => {
  const pinnedMessages = ref<Map<string, string[]>>(new Map()) // chatId -> messageIds

  const pinMessage = async (chatId: string, messageId: string): Promise<void> => {
    await $fetch(`/api/chat/chats/${chatId}/pins`, {
      method: 'POST',
      body: { messageId }
    })

    const current = pinnedMessages.value.get(chatId) || []
    if (!current.includes(messageId)) {
      pinnedMessages.value.set(chatId, [messageId, ...current].slice(0, 5)) // Max 5 pinned
    }
  }

  const unpinMessage = async (chatId: string, messageId: string): Promise<void> => {
    await $fetch(`/api/chat/chats/${chatId}/pins/${messageId}`, {
      method: 'DELETE'
    })

    const current = pinnedMessages.value.get(chatId) || []
    pinnedMessages.value.set(chatId, current.filter(id => id !== messageId))
  }

  const unpinAll = async (chatId: string): Promise<void> => {
    await $fetch(`/api/chat/chats/${chatId}/pins`, { method: 'DELETE' })
    pinnedMessages.value.delete(chatId)
  }

  return {
    pinnedMessages: computed(() => pinnedMessages.value),
    pinMessage,
    unpinMessage,
    unpinAll
  }
}
