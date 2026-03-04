import type { SearchFilters, SearchResult, SearchIndex } from '../types'

// Advanced Search (Elastic-like) - Full-text, fuzzy matching, OCR
export const useAdvancedSearch = () => {
  const config = useRuntimeConfig()
  const isSearching = ref(false)
  const searchResults = ref<SearchResult[]>([])
  const totalResults = ref(0)
  const searchHistory = useLocalStorage<string[]>('wchat:search:history', [])
  const savedSearches = useLocalStorage<Array<{ name: string; query: string; filters: SearchFilters }>>('wchat:search:saved', [])
  const recentSearches = computed(() => searchHistory.value.slice(0, 10))

  // Full-text search with filters
  const search = async (
    query: string,
    filters?: SearchFilters,
    options?: {
      offset?: number
      limit?: number
      fuzzy?: boolean
      highlight?: boolean
    }
  ): Promise<void> => {
    if (!config.public.wchat?.enableAdvancedSearch || !query.trim()) {
      searchResults.value = []
      return
    }

    isSearching.value = true
    try {
      const response = await $fetch<{
        results: SearchResult[]
        total: number
        suggestions?: string[]
      }>('/api/chat/search/advanced', {
        method: 'POST',
        body: {
          query,
          filters,
          options: {
            offset: options?.offset || 0,
            limit: options?.limit || 50,
            fuzzy: options?.fuzzy ?? true,
            highlight: options?.highlight ?? true
          }
        }
      })

      searchResults.value = response.results
      totalResults.value = response.total

      // Add to history
      if (!searchHistory.value.includes(query)) {
        searchHistory.value.unshift(query)
        if (searchHistory.value.length > 20) {
          searchHistory.value = searchHistory.value.slice(0, 20)
        }
      }
    } finally {
      isSearching.value = false
    }
  }

  // Search in specific chat
  const searchInChat = async (
    chatId: string,
    query: string,
    filters?: Omit<SearchFilters, 'chatId'>
  ): Promise<SearchResult[]> => {
    return await $fetch<SearchResult[]>('/api/chat/search/chat', {
      method: 'POST',
      body: {
        chatId,
        query,
        filters
      }
    })
  }

  // Fuzzy search (typo-tolerant)
  const fuzzySearch = async (
    query: string,
    maxDistance = 2
  ): Promise<SearchResult[]> => {
    return await $fetch<SearchResult[]>('/api/chat/search/fuzzy', {
      method: 'POST',
      body: { query, maxDistance }
    })
  }

  // Search by date range
  const searchByDate = async (
    query: string,
    startDate: Date,
    endDate: Date,
    chatId?: string
  ): Promise<SearchResult[]> => {
    return await search({
      query,
      dateRange: { start: startDate, end: endDate },
      ...(chatId && { chatId })
    } as SearchFilters)
  }

  // Search media/OCR
  const searchMedia = async (
    query: string,
    type: 'image' | 'video' | 'document' | 'all' = 'all'
  ): Promise<SearchResult[]> => {
    return await $fetch<SearchResult[]>('/api/chat/search/media', {
      method: 'POST',
      body: {
        query,
        type,
        ocr: true // Enable OCR for images
      }
    })
  }

  // Search by sender
  const searchBySender = async (
    senderId: string,
    query?: string
  ): Promise<SearchResult[]> => {
    return await $fetch<SearchResult[]>('/api/chat/search/sender', {
      method: 'POST',
      body: { senderId, query }
    })
  }

  // Search by hashtag
  const searchByHashtag = async (hashtag: string): Promise<SearchResult[]> => {
    return await search(`#${hashtag}`, { type: 'text' })
  }

  // Search by mention
  const searchByMention = async (username: string): Promise<SearchResult[]> => {
    return await search(`@${username}`, { type: 'text' })
  }

  // Voice search (speech-to-text then search)
  const voiceSearch = async (audioBlob: Blob): Promise<SearchResult[]> => {
    const formData = new FormData()
    formData.append('audio', audioBlob)

    const { text } = await $fetch<{ text: string }>('/api/chat/search/voice', {
      method: 'POST',
      body: formData
    })

    await search(text)
    return searchResults.value
  }

  // Save search
  const saveSearch = (name: string, query: string, filters: SearchFilters): void => {
    savedSearches.value.push({ name, query, filters })
  }

  // Delete saved search
  const deleteSavedSearch = (index: number): void => {
    savedSearches.value.splice(index, 1)
  }

  // Clear history
  const clearHistory = (): void => {
    searchHistory.value = []
  }

  // Get search suggestions
  const getSuggestions = async (partial: string): Promise<string[]> => {
    if (!partial.trim()) return []

    return await $fetch<string[]>('/api/chat/search/suggestions', {
      params: { q: partial }
    })
  }

  // Build search index (admin function)
  const buildIndex = async (): Promise<void> => {
    await $fetch('/api/chat/search/index', { method: 'POST' })
  }

  // Export search results
  const exportResults = async (format: 'json' | 'csv' | 'pdf'): Promise<Blob> => {
    return await $fetch<Blob>('/api/chat/search/export', {
      method: 'POST',
      body: {
        format,
        results: searchResults.value.map(r => r.id)
      }
    })
  }

  return {
    isSearching: readonly(isSearching),
    searchResults: readonly(searchResults),
    totalResults: readonly(totalResults),
    searchHistory: readonly(searchHistory),
    savedSearches: readonly(savedSearches),
    recentSearches,
    search,
    searchInChat,
    fuzzySearch,
    searchByDate,
    searchMedia,
    searchBySender,
    searchByHashtag,
    searchByMention,
    voiceSearch,
    saveSearch,
    deleteSavedSearch,
    clearHistory,
    getSuggestions,
    buildIndex,
    exportResults
  }
}

// Quick search hook
export const useQuickSearch = () => {
  const { search, isSearching, searchResults } = useAdvancedSearch()
  const query = ref('')
  const showResults = ref(false)

  const executeSearch = async (): Promise<void> => {
    if (!query.value.trim()) return
    await search(query.value)
    showResults.value = true
  }

  const clear = (): void => {
    query.value = ''
    showResults.value = false
  }

  return {
    query,
    isSearching,
    searchResults,
    showResults,
    executeSearch,
    clear
  }
}

// Search filters preset
export const defaultSearchFilters: SearchFilters = {
  type: undefined,
  dateRange: undefined,
  senderId: undefined,
  chatId: undefined,
  hasAttachments: undefined,
  isPinned: undefined,
  isEdited: undefined
}
