import type { ScheduledMessage, MessageStats, ChatStats } from '../types'

// Scheduled Messages List - View/manage all scheduled messages
export const useScheduledMessagesList = () => {
  const config = useRuntimeConfig()
  const scheduledMessages = ref<ScheduledMessage[]>([])
  const isLoading = ref(false)

  // Load all scheduled messages
  const loadScheduled = async (): Promise<void> => {
    if (!config.public.wchat?.enableScheduling) return

    isLoading.value = true
    try {
      const data = await $fetch<ScheduledMessage[]>('/api/chat/scheduled')
      scheduledMessages.value = data.sort((a, b) =>
        new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
      )
    } finally {
      isLoading.value = false
    }
  }

  // Cancel scheduled message
  const cancelScheduled = async (messageId: string): Promise<void> => {
    await $fetch(`/api/chat/scheduled/${messageId}`, { method: 'DELETE' })
    scheduledMessages.value = scheduledMessages.value.filter(m => m.id !== messageId)
  }

  // Reschedule message
  const reschedule = async (
    messageId: string,
    newTime: Date
  ): Promise<ScheduledMessage | null> => {
    const updated = await $fetch<ScheduledMessage>(`/api/chat/scheduled/${messageId}`, {
      method: 'PUT',
      body: { scheduledFor: newTime }
    })

    const index = scheduledMessages.value.findIndex(m => m.id === messageId)
    if (index >= 0) {
      scheduledMessages.value[index] = updated
    }

    return updated
  }

  // Get upcoming count
  const upcomingCount = computed(() => {
    const now = new Date()
    return scheduledMessages.value.filter(m =>
      new Date(m.scheduledFor) > now && m.status === 'pending'
    ).length
  })

  return {
    scheduledMessages: readonly(scheduledMessages),
    isLoading: readonly(isLoading),
    upcomingCount,
    loadScheduled,
    cancelScheduled,
    reschedule
  }
}

// Message Stats - Per-chat statistics
export const useMessageStats = () => {
  const config = useRuntimeConfig()
  const stats = ref<Map<string, MessageStats>>(new Map())

  // Load stats for chat
  const loadStats = async (chatId: string): Promise<MessageStats | null> => {
    if (!config.public.wchat?.enableStats) return null

    const data = await $fetch<MessageStats>(`/api/chat/chats/${chatId}/stats`)
    stats.value.set(chatId, data)
    return data
  }

  // Get character count for chat
  const getCharacterCount = (chatId: string): number => {
    return stats.value.get(chatId)?.totalCharacters || 0
  }

  // Get message count
  const getMessageCount = (chatId: string): number => {
    return stats.value.get(chatId)?.totalMessages || 0
  }

  // Get activity graph data
  const getActivityGraph = (chatId: string): Array<{
    date: string
    count: number
  }> => {
    return stats.value.get(chatId)?.dailyActivity || []
  }

  return {
    stats: readonly(stats),
    loadStats,
    getCharacterCount,
    getMessageCount,
    getActivityGraph
  }
}

// Group Analytics - Admin dashboard
export const useGroupAnalytics = () => {
  const config = useRuntimeConfig()
  const analytics = ref<ChatStats | null>(null)
  const isLoading = ref(false)

  // Load group analytics
  const loadAnalytics = async (chatId: string): Promise<ChatStats | null> => {
    if (!config.public.wchat?.enableAnalytics) return null

    isLoading.value = true
    try {
      const data = await $fetch<ChatStats>(`/api/chat/chats/${chatId}/analytics`)
      analytics.value = data
      return data
    } finally {
      isLoading.value = false
    }
  }

  // Get member growth data
  const getMemberGrowth = (days = 30): Array<{
    date: string
    count: number
  }> => {
    return analytics.value?.memberGrowth?.slice(-days) || []
  }

  // Get top contributors
  const getTopContributors = (limit = 10): Array<{
    userId: string
    username: string
    messageCount: number
  }> => {
    return analytics.value?.topContributors?.slice(0, limit) || []
  }

  // Get engagement rate
  const getEngagementRate = (): number => {
    return analytics.value?.engagementRate || 0
  }

  // Export analytics
  const exportAnalytics = async (
    chatId: string,
    format: 'csv' | 'json' = 'csv'
  ): Promise<Blob | null> => {
    return await $fetch<Blob>(`/api/chat/chats/${chatId}/analytics/export`, {
      method: 'POST',
      body: { format }
    })
  }

  return {
    analytics: readonly(analytics),
    isLoading: readonly(isLoading),
    loadAnalytics,
    getMemberGrowth,
    getTopContributors,
    getEngagementRate,
    exportAnalytics
  }
}

// Typing Indicator Customization
export const useTypingIndicator = () => {
  const config = useRuntimeConfig()
  const indicatorType = useLocalStorage<'dots' | 'text' | 'avatar'>('wchat:typing:type', 'dots')
  const customText = useLocalStorage('wchat:typing:text', 'typing...')
  const showAvatar = useLocalStorage('wchat:typing:avatar', true)

  // Get indicator text based on action
  const getIndicatorText = (action?: string): string => {
    const texts: Record<string, string> = {
      typing: customText.value,
      recording: 'recording voice...',
      uploading: 'uploading photo...',
      choosing: 'choosing sticker...',
      sending: 'sending...'
    }
    return texts[action || 'typing'] || customText.value
  }

  // Set indicator type
  const setType = (type: 'dots' | 'text' | 'avatar'): void => {
    indicatorType.value = type
  }

  // Set custom text
  const setCustomText = (text: string): void => {
    customText.value = text
  }

  // Toggle avatar
  const toggleAvatar = (enabled: boolean): void => {
    showAvatar.value = enabled
  }

  return {
    indicatorType: readonly(indicatorType),
    customText: readonly(customText),
    showAvatar: readonly(showAvatar),
    getIndicatorText,
    setType,
    setCustomText,
    toggleAvatar
  }
}

// Auto-Delete Chats
export const useAutoDelete = () => {
  const config = useRuntimeConfig()
  const chatSettings = useLocalStorage<Record<string, {
    enabled: boolean
    duration: number // seconds
  }>>('wchat:auto-delete', {})

  // Set auto-delete for chat
  const setAutoDelete = async (
    chatId: string,
    duration: number // in seconds, 0 to disable
  ): Promise<void> => {
    if (!config.public.wchat?.enableAutoDelete) return

    await $fetch(`/api/chat/chats/${chatId}/auto-delete`, {
      method: 'PUT',
      body: { duration }
    })

    chatSettings.value[chatId] = {
      enabled: duration > 0,
      duration
    }
  }

  // Get auto-delete setting
  const getAutoDelete = (chatId: string): {
    enabled: boolean
    duration: number
  } => {
    return chatSettings.value[chatId] || { enabled: false, duration: 0 }
  }

  // Disable auto-delete
  const disableAutoDelete = async (chatId: string): Promise<void> => {
    await setAutoDelete(chatId, 0)
  }

  // Preset durations
  const presets = [
    { label: '1 day', value: 86400 },
    { label: '1 week', value: 604800 },
    { label: '1 month', value: 2592000 }
  ]

  return {
    chatSettings: readonly(chatSettings),
    presets,
    setAutoDelete,
    getAutoDelete,
    disableAutoDelete
  }
}

// Disappearing Photos
export const useDisappearingPhotos = () => {
  const config = useRuntimeConfig()
  const activePhotos = ref<Map<string, {
    expiresAt: number
    viewed: boolean
  }>>(new Map())

  // Mark photo as viewed
  const viewPhoto = async (photoId: string): Promise<void> => {
    if (!config.public.wchat?.enableDisappearingPhotos) return

    await $fetch(`/api/chat/photos/${photoId}/view`, { method: 'POST' })

    const existing = activePhotos.value.get(photoId)
    if (existing) {
      existing.viewed = true
    }
  }

  // Send disappearing photo
  const sendDisappearingPhoto = async (
    chatId: string,
    file: File,
    viewOnce = true
  ): Promise<{ id: string; url: string } | null> => {
    const formData = new FormData()
    formData.append('photo', file)
    formData.append('viewOnce', viewOnce.toString())

    return await $fetch<{ id: string; url: string }>(`/api/chat/chats/${chatId}/disappearing-photo`, {
      method: 'POST',
      body: formData
    })
  }

  return {
    activePhotos: readonly(activePhotos),
    viewPhoto,
    sendDisappearingPhoto
  }
}

// Chat Folders Sync
export const useFolderSync = () => {
  const config = useRuntimeConfig()
  const lastSync = useLocalStorage<string | null>('wchat:folders:last-sync', null)
  const isSyncing = ref(false)

  // Sync folders with server
  const syncFolders = async (): Promise<void> => {
    if (!config.public.wchat?.enableFolderSync) return

    isSyncing.value = true
    try {
      await $fetch('/api/chat/folders/sync', { method: 'POST' })
      lastSync.value = new Date().toISOString()
    } finally {
      isSyncing.value = false
    }
  }

  return {
    lastSync: readonly(lastSync),
    isSyncing: readonly(isSyncing),
    syncFolders
  }
}

// Drafts Preview
export const useDraftsPreview = () => {
  const config = useRuntimeConfig()
  const drafts = useLocalStorage<Record<string, string>>('wchat:drafts', {})
  const showPreview = useLocalStorage('wchat:drafts:show-preview', true)

  // Save draft
  const saveDraft = (chatId: string, content: string): void => {
    if (content.trim()) {
      drafts.value[chatId] = content
    } else {
      delete drafts.value[chatId]
    }
  }

  // Get draft preview (truncated)
  const getDraftPreview = (chatId: string, maxLength = 50): string | null => {
    const content = drafts.value[chatId]
    if (!content || !showPreview.value) return null

    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  // Clear draft
  const clearDraft = (chatId: string): void => {
    delete drafts.value[chatId]
  }

  return {
    drafts: readonly(drafts),
    showPreview: readonly(showPreview),
    saveDraft,
    getDraftPreview,
    clearDraft
  }
}

// Voice-to-Text Real-time
export const useVoiceToText = () => {
  const config = useRuntimeConfig()
  const isListening = ref(false)
  const transcript = ref('')
  const confidence = ref(0)
  const recognition = ref<SpeechRecognition | null>(null)

  // Check support
  const isSupported = computed(() => {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  })

  // Initialize speech recognition
  const initRecognition = (): void => {
    if (!isSupported.value) return

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition.value = new SpeechRecognitionAPI()
    recognition.value.continuous = true
    recognition.value.interimResults = true
    recognition.value.lang = 'en-US'

    recognition.value.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
          confidence.value = event.results[i][0].confidence
        } else {
          interimTranscript += transcript
        }
      }

      transcript.value = finalTranscript + interimTranscript
    }

    recognition.value.onerror = () => {
      stopListening()
    }

    recognition.value.onend = () => {
      if (isListening.value) {
        recognition.value?.start()
      }
    }
  }

  // Start listening
  const startListening = (): void => {
    if (!config.public.wchat?.enableVoiceToText) return
    if (!recognition.value) {
      initRecognition()
    }

    transcript.value = ''
    isListening.value = true
    recognition.value?.start()
  }

  // Stop listening
  const stopListening = (): void => {
    isListening.value = false
    recognition.value?.stop()
  }

  // Toggle listening
  const toggleListening = (): void => {
    if (isListening.value) {
      stopListening()
    } else {
      startListening()
    }
  }

  return {
    isListening: readonly(isListening),
    transcript: readonly(transcript),
    confidence: readonly(confidence),
    isSupported,
    startListening,
    stopListening,
    toggleListening
  }
}
