import type { LinkPreview } from '../types'

const cache = new Map<string, LinkPreview>()

export function useLinkPreview() {
  const preview = ref<LinkPreview | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchPreview = async (url: string): Promise<LinkPreview | null> => {
    if (cache.has(url)) {
      preview.value = cache.get(url)!
      return preview.value
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`/api/wmarkdown/preview?url=${encodeURIComponent(url)}`)

      if (!response.ok) {
        throw new Error('Failed to fetch preview')
      }

      const data = await response.json()
      const result: LinkPreview = {
        url,
        title: data.title,
        description: data.description,
        image: data.image
      }

      cache.set(url, result)
      preview.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const clearPreview = () => {
    preview.value = null
    error.value = null
  }

  return {
    preview: readonly(preview),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchPreview,
    clearPreview
  }
}
