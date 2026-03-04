import type { MediaFile, StickerSet, Sticker, CustomEmoji } from '../types'

// Feature 17-24: Large File Sharing, Media Streaming, Stickers, Custom Emoji
export const useMedia = () => {
  const config = useRuntimeConfig()
  const MAX_FILE_SIZE = config.public.wchat.maxFileSize || 4 * 1024 * 1024 * 1024 // 4GB

  const uploadProgress = ref<Map<string, number>>(new Map())
  const downloadProgress = ref<Map<string, number>>(new Map())

  // Feature 17: Large File Upload (up to 4GB)
  const uploadFile = async (
    file: File,
    chatId: string,
    onProgress?: (progress: number) => void
  ): Promise<MediaFile | null> => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum of ${formatFileSize(MAX_FILE_SIZE)}`)
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('chatId', chatId)
    formData.append('fileName', file.name)
    formData.append('fileSize', file.size.toString())
    formData.append('mimeType', file.type)

    const uploadId = `upload-${Date.now()}`
    uploadProgress.value.set(uploadId, 0)

    try {
      const { data } = await $fetch('/api/chat/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100)
          uploadProgress.value.set(uploadId, percent)
          onProgress?.(percent)
        }
      })

      return data
    } finally {
      uploadProgress.value.delete(uploadId)
    }
  }

  // Feature 19: Pause/Resume Downloads
  const downloadFile = async (
    mediaId: string,
    fileName: string,
    options?: {
      compressed?: boolean
      startByte?: number
      onProgress?: (progress: number) => void
    }
  ): Promise<Blob> => {
    const downloadId = `download-${mediaId}`
    downloadProgress.value.set(downloadId, 0)

    const headers: HeadersInit = {}
    if (options?.startByte) {
      headers['Range'] = `bytes=${options.startByte}-`
    }

    try {
      const response = await fetch(`/api/chat/download/${mediaId}?compressed=${options?.compressed ?? false}`, {
        headers
      })

      if (!response.ok) throw new Error('Download failed')

      const contentLength = Number(response.headers.get('content-length') || 0)
      const reader = response.body?.getReader()

      if (!reader) throw new Error('No response body')

      const chunks: Uint8Array[] = []
      let received = options?.startByte || 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        chunks.push(value)
        received += value.length

        if (contentLength > 0) {
          const progress = Math.round((received / (contentLength + (options?.startByte || 0))) * 100)
          downloadProgress.value.set(downloadId, progress)
          options?.onProgress?.(progress)
        }
      }

      // Combine chunks
      const allChunks = new Uint8Array(received - (options?.startByte || 0))
      let position = 0
      for (const chunk of chunks) {
        allChunks.set(chunk, position)
        position += chunk.length
      }

      return new Blob([allChunks])
    } finally {
      downloadProgress.value.delete(downloadId)
    }
  }

  // Feature 18: Media Streaming
  const getStreamingUrl = (mediaId: string): string => {
    return `/api/chat/stream/${mediaId}`
  }

  const canStream = (mimeType: string): boolean => {
    return mimeType.startsWith('video/') || mimeType.startsWith('audio/')
  }

  return {
    MAX_FILE_SIZE,
    uploadFile,
    downloadFile,
    getStreamingUrl,
    canStream,
    uploadProgress: computed(() => uploadProgress.value),
    downloadProgress: computed(() => downloadProgress.value)
  }
}

// Feature 20: Auto-Download Controls
export const useAutoDownload = () => {
  const settings = useLocalStorage('wchat-auto-download', {
    wifi: {
      photos: true,
      videos: true,
      documents: true,
      voice: true,
      maxSize: 50 * 1024 * 1024 // 50MB
    },
    mobile: {
      photos: true,
      videos: false,
      documents: true,
      voice: true,
      maxSize: 5 * 1024 * 1024 // 5MB
    }
  })

  const shouldAutoDownload = (type: 'photos' | 'videos' | 'documents' | 'voice', fileSize: number): boolean => {
    const isWifi = navigator.connection?.effectiveType === 'wifi'
    const config = isWifi ? settings.value.wifi : settings.value.mobile

    return config[type] && fileSize <= config.maxSize
  }

  const updateSettings = (network: 'wifi' | 'mobile', updates: Partial<typeof settings.value.wifi>) => {
    settings.value[network] = { ...settings.value[network], ...updates }
  }

  return {
    settings: readonly(settings),
    shouldAutoDownload,
    updateSettings
  }
}

// Feature 21-24: Sticker Platform, Animated Emoji, Video Stickers, Custom Emoji
export const useStickers = () => {
  const installedStickerSets = ref<StickerSet[]>([])
  const recentStickers = ref<Sticker[]>([])
  const favoriteStickers = ref<Sticker[]>([])
  const customEmoji = ref<CustomEmoji[]>([])

  const loadStickerSet = async (setId: string): Promise<StickerSet | null> => {
    const { data } = await $fetch(`/api/chat/stickers/${setId}`)
    return data
  }

  const installStickerSet = async (setId: string): Promise<void> => {
    await $fetch(`/api/chat/stickers/${setId}/install`, { method: 'POST' })
  }

  const uninstallStickerSet = async (setId: string): Promise<void> => {
    await $fetch(`/api/chat/stickers/${setId}/uninstall`, { method: 'DELETE' })
  }

  const searchStickers = async (query: string, animated?: boolean): Promise<StickerSet[]> => {
    const { data } = await $fetch(`/api/chat/stickers/search`, {
      params: { q: query, animated }
    })
    return data || []
  }

  const addToFavorites = (sticker: Sticker) => {
    if (!favoriteStickers.value.find(s => s.id === sticker.id)) {
      favoriteStickers.value.push(sticker)
    }
  }

  const removeFromFavorites = (stickerId: string) => {
    const index = favoriteStickers.value.findIndex(s => s.id === stickerId)
    if (index > -1) favoriteStickers.value.splice(index, 1)
  }

  const addToRecent = (sticker: Sticker) => {
    recentStickers.value = [sticker, ...recentStickers.value.filter(s => s.id !== sticker.id)].slice(0, 20)
  }

  // Animated Emoji
  const getAnimatedEmoji = (emoji: string): string | null => {
    const mapping: Record<string, string> = {
      '🎉': '/stickers/animated/party.webp',
      '❤️': '/stickers/animated/heart.webp',
      '🔥': '/stickers/animated/fire.webp',
      '😂': '/stickers/animated/laugh.webp',
      '😭': '/stickers/animated/cry.webp',
      '🤔': '/stickers/animated/think.webp',
      '👍': '/stickers/animated/thumbsup.webp',
      '👎': '/stickers/animated/thumbsdown.webp'
    }
    return mapping[emoji] || null
  }

  // Video Stickers (WebM format)
  const isVideoSticker = (sticker: Sticker): boolean => {
    return sticker.file.mimeType === 'video/webm' || sticker.isVideo
  }

  // Custom Emoji
  const uploadCustomEmoji = async (
    file: File,
    emoji: string,
    isAnimated: boolean
  ): Promise<CustomEmoji | null> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('emoji', emoji)
    formData.append('isAnimated', isAnimated.toString())

    const { data } = await $fetch('/api/chat/custom-emoji', {
      method: 'POST',
      body: formData
    })

    if (data) {
      customEmoji.value.push(data)
    }
    return data
  }

  return {
    installedStickerSets: computed(() => installedStickerSets.value),
    recentStickers: computed(() => recentStickers.value),
    favoriteStickers: computed(() => favoriteStickers.value),
    customEmoji: computed(() => customEmoji.value),
    loadStickerSet,
    installStickerSet,
    uninstallStickerSet,
    searchStickers,
    addToFavorites,
    removeFromFavorites,
    addToRecent,
    getAnimatedEmoji,
    isVideoSticker,
    uploadCustomEmoji
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
