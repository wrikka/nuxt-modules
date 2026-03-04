import { readonly, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export interface ShortenedURL {
  id: string
  original: string
  short: string
  createdAt: number
  clicks: number
  customAlias?: string
}

/**
 * URL Shortener - Shorten and expand URLs from palette
 */
export function useURLShortener() {
  const urls = useLocalStorage<ShortenedURL[]>('palette:short-urls', [])
  const isProcessing = ref(false)

  const generateShortId = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const shorten = (original: string, customAlias?: string): ShortenedURL | null => {
    try {
      new URL(original)
    }
    catch {
      return null
    }

    isProcessing.value = true

    const existing = urls.value.find(u => u.original === original)
    if (existing) {
      isProcessing.value = false
      return existing
    }

    const id = customAlias || generateShortId()

    if (customAlias && urls.value.some(u => u.id === id)) {
      isProcessing.value = false
      return null
    }

    const shortUrl: ShortenedURL = {
      id,
      original,
      short: `${window.location.origin}/s/${id}`,
      createdAt: Date.now(),
      clicks: 0,
      customAlias
    }

    urls.value = [shortUrl, ...urls.value]
    isProcessing.value = false
    return shortUrl
  }

  const expand = (shortId: string): string | null => {
    const url = urls.value.find(u => u.id === shortId || u.short.endsWith(`/${shortId}`))
    if (url) {
      url.clicks++
      return url.original
    }
    return null
  }

  const getStats = (id: string) => {
    const url = urls.value.find(u => u.id === id)
    return url ? { clicks: url.clicks, createdAt: url.createdAt } : null
  }

  const deleteUrl = (id: string): boolean => {
    const initialLength = urls.value.length
    urls.value = urls.value.filter(u => u.id !== id)
    return urls.value.length < initialLength
  }

  const copyToClipboard = async (url: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(url)
      return true
    }
    catch {
      return false
    }
  }

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    }
    catch {
      return false
    }
  }

  const getRecentURLs = (count = 5): ShortenedURL[] => {
    return urls.value.slice(0, count)
  }

  const searchURLs = (query: string): ShortenedURL[] => {
    const q = query.toLowerCase()
    return urls.value.filter(u =>
      u.original.toLowerCase().includes(q) ||
      u.short.toLowerCase().includes(q) ||
      u.customAlias?.toLowerCase().includes(q)
    )
  }

  return {
    urls: readonly(urls),
    isProcessing: readonly(isProcessing),
    shorten,
    expand,
    getStats,
    deleteUrl,
    copyToClipboard,
    isValidUrl,
    getRecentURLs,
    searchURLs
  }
}
