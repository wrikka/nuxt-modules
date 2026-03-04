import type { Story, StoryViewer, StoryReaction } from '../types'

// Stories/Status - 24h disappearing photos/videos
export const useStories = () => {
  const config = useRuntimeConfig()
  const stories = ref<Map<string, Story[]>>(new Map())
  const myStories = ref<Story[]>([])
  const isLoading = ref(false)
  const currentStory = ref<Story | null>(null)
  const currentIndex = ref(0)
  const isViewing = ref(false)

  // Load stories from contacts
  const loadStories = async (): Promise<void> => {
    if (!config.public.wchat?.enableStories) return

    isLoading.value = true
    try {
      const data = await $fetch<Story[]>('/api/chat/stories')
      // Group by user
      const grouped = new Map<string, Story[]>()
      data.forEach(story => {
        const userStories = grouped.get(story.userId) || []
        userStories.push(story)
        grouped.set(story.userId, userStories)
      })
      stories.value = grouped
    } finally {
      isLoading.value = false
    }
  }

  // Load my stories
  const loadMyStories = async (): Promise<void> => {
    if (!config.public.wchat?.enableStories) return

    try {
      const data = await $fetch<Story[]>('/api/chat/stories/me')
      myStories.value = data.filter(s => !s.isExpired)
    } catch {
      myStories.value = []
    }
  }

  // Create story
  const createStory = async (
    file: File,
    options?: {
      caption?: string
      privacy?: 'all' | 'contacts' | 'selected'
      selectedUsers?: string[]
      allowReplies?: boolean
      allowReactions?: boolean
    }
  ): Promise<Story | null> => {
    if (!config.public.wchat?.enableStories) return null

    const formData = new FormData()
    formData.append('file', file)
    if (options?.caption) formData.append('caption', options.caption)
    if (options?.privacy) formData.append('privacy', options.privacy)
    if (options?.selectedUsers) formData.append('selectedUsers', JSON.stringify(options.selectedUsers))

    const story = await $fetch<Story>('/api/chat/stories', {
      method: 'POST',
      body: formData
    })

    myStories.value.push(story)
    return story
  }

  // View story
  const viewStory = async (storyId: string): Promise<void> => {
    await $fetch(`/api/chat/stories/${storyId}/view`, { method: 'POST' })
  }

  // React to story
  const reactToStory = async (
    storyId: string,
    reaction: { emoji: string; isAnimated?: boolean }
  ): Promise<void> => {
    await $fetch(`/api/chat/stories/${storyId}/react`, {
      method: 'POST',
      body: reaction
    })
  }

  // Reply to story
  const replyToStory = async (storyId: string, message: string): Promise<void> => {
    await $fetch(`/api/chat/stories/${storyId}/reply`, {
      method: 'POST',
      body: { message }
    })
  }

  // Delete story
  const deleteStory = async (storyId: string): Promise<void> => {
    await $fetch(`/api/chat/stories/${storyId}`, { method: 'DELETE' })
    myStories.value = myStories.value.filter(s => s.id !== storyId)
  }

  // Get story viewers
  const getStoryViewers = async (storyId: string): Promise<StoryViewer[]> => {
    return await $fetch<StoryViewer[]>(`/api/chat/stories/${storyId}/viewers`)
  }

  // Story viewer navigation
  const startViewing = (userId: string, index = 0): void => {
    const userStories = stories.value.get(userId)
    if (!userStories?.length) return

    currentIndex.value = index
    currentStory.value = userStories[index]
    isViewing.value = true
    viewStory(currentStory.value.id)
  }

  const nextStory = (): void => {
    if (!currentStory.value) return
    const userStories = stories.value.get(currentStory.value.userId)
    if (!userStories) return

    if (currentIndex.value < userStories.length - 1) {
      currentIndex.value++
      currentStory.value = userStories[currentIndex.value]
      viewStory(currentStory.value.id)
    } else {
      // Move to next user
      const userIds = Array.from(stories.value.keys())
      const currentUserIndex = userIds.indexOf(currentStory.value.userId)
      if (currentUserIndex < userIds.length - 1) {
        const nextUserId = userIds[currentUserIndex + 1]
        startViewing(nextUserId, 0)
      } else {
        closeViewer()
      }
    }
  }

  const previousStory = (): void => {
    if (!currentStory.value) return
    const userStories = stories.value.get(currentStory.value.userId)
    if (!userStories) return

    if (currentIndex.value > 0) {
      currentIndex.value--
      currentStory.value = userStories[currentIndex.value]
    } else {
      // Move to previous user
      const userIds = Array.from(stories.value.keys())
      const currentUserIndex = userIds.indexOf(currentStory.value.userId)
      if (currentUserIndex > 0) {
        const prevUserId = userIds[currentUserIndex - 1]
        const prevStories = stories.value.get(prevUserId)
        if (prevStories) {
          startViewing(prevUserId, prevStories.length - 1)
        }
      }
    }
  }

  const closeViewer = (): void => {
    isViewing.value = false
    currentStory.value = null
    currentIndex.value = 0
  }

  // Check if user has stories
  const hasStories = (userId: string): boolean => {
    const userStories = stories.value.get(userId)
    return !!userStories && userStories.length > 0 && userStories.some(s => !s.isExpired)
  }

  // Get unseen count
  const getUnseenCount = (userId: string): number => {
    const userStories = stories.value.get(userId)
    if (!userStories) return 0
    return userStories.filter(s => !s.isExpired && !s.isViewed).length
  }

  // Auto-delete expired stories
  const cleanupExpiredStories = (): void => {
    const now = new Date()
    stories.value.forEach((userStories, userId) => {
      const valid = userStories.filter(s => !s.isExpired && new Date(s.expiresAt) > now)
      if (valid.length === 0) {
        stories.value.delete(userId)
      } else {
        stories.value.set(userId, valid)
      }
    })
    myStories.value = myStories.value.filter(s => !s.isExpired && new Date(s.expiresAt) > now)
  }

  // Watch for expired stories
  onMounted(() => {
    const interval = setInterval(cleanupExpiredStories, 60000) // Check every minute
    onUnmounted(() => clearInterval(interval))
  })

  return {
    stories: readonly(stories),
    myStories: readonly(myStories),
    isLoading: readonly(isLoading),
    currentStory: readonly(currentStory),
    isViewing: readonly(isViewing),
    currentIndex: readonly(currentIndex),
    loadStories,
    loadMyStories,
    createStory,
    viewStory,
    reactToStory,
    replyToStory,
    deleteStory,
    getStoryViewers,
    startViewing,
    nextStory,
    previousStory,
    closeViewer,
    hasStories,
    getUnseenCount,
    cleanupExpiredStories
  }
}

// Hook for story creation (camera/media picker)
export const useStoryCreator = () => {
  const isOpen = ref(false)
  const selectedFile = ref<File | null>(null)
  const previewUrl = ref<string>('')
  const caption = ref('')
  const privacy = ref<'all' | 'contacts' | 'selected'>('all')
  const selectedUsers = ref<string[]>([])

  const open = (): void => {
    isOpen.value = true
  }

  const close = (): void => {
    isOpen.value = false
    selectedFile.value = null
    previewUrl.value = ''
    caption.value = ''
    privacy.value = 'all'
    selectedUsers.value = []
  }

  const selectFile = (file: File): void => {
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }

  const capturePhoto = async (): Promise<void> => {
    // Use getUserMedia to capture photo
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // Capture frame logic would go here
      stream.getTracks().forEach(track => track.stop())
    } catch {
      // Handle error
    }
  }

  return {
    isOpen: readonly(isOpen),
    selectedFile: readonly(selectedFile),
    previewUrl: readonly(previewUrl),
    caption,
    privacy,
    selectedUsers,
    open,
    close,
    selectFile,
    capturePhoto
  }
}
