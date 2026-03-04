import { ref, computed, watch } from "vue"
import { useDebounceFn } from "@vueuse/core"
import type { Product } from "~~/types"

export interface SearchFilters {
  categories?: string[]
  priceRange?: { min: number; max: number }
  brands?: string[]
  attributes?: Record<string, string[]>
  rating?: number
  inStock?: boolean
  onSale?: boolean
}

export interface SearchResult {
  products: Product[]
  total: number
  facets: Array<{
    field: string
    values: Array<{ value: string; count: number }>
  }>
  suggestions: string[]
  didYouMean?: string
}

export interface AISearchQuery {
  naturalLanguage: string
  intent: "find" | "compare" | "discover" | "question"
  entities: Array<{
    type: "product" | "category" | "brand" | "attribute" | "price"
    value: string
    confidence: number
  }>
}

export const useAISearch = () => {
  const query = ref("")
  const filters = ref<SearchFilters>({})
  const results = ref<SearchResult | null>(null)
  const loading = ref(false)
  const searchHistory = ref<string[]>([])
  const trendingSearches = ref<string[]>([])

  const debouncedSearch = useDebounceFn(async () => {
    if (!query.value.trim()) {
      results.value = null
      return
    }

    loading.value = true
    try {
      const data = await $fetch<SearchResult>("/api/shop/search/ai", {
        method: "POST",
        body: {
          query: query.value,
          filters: filters.value,
          context: {
            userPreferences: [],
            recentViews: [],
          },
        },
      })
      results.value = data

      // Add to history if successful
      if (!searchHistory.value.includes(query.value)) {
        searchHistory.value.unshift(query.value)
        if (searchHistory.value.length > 10) {
          searchHistory.value.pop()
        }
      }
    } finally {
      loading.value = false
    }
  }, 300)

  watch(query, () => {
    debouncedSearch()
  })

  const search = async (searchQuery: string, searchFilters?: SearchFilters): Promise<SearchResult> => {
    query.value = searchQuery
    if (searchFilters) {
      filters.value = searchFilters
    }

    loading.value = true
    try {
      const data = await $fetch<SearchResult>("/api/shop/search/ai", {
        method: "POST",
        body: {
          query: searchQuery,
          filters: searchFilters || filters.value,
        },
      })
      results.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const getSuggestions = async (partial: string): Promise<string[]> => {
    if (!partial.trim() || partial.length < 2) return []

    return await $fetch<string[]>("/api/shop/search/suggestions", {
      params: { q: partial },
    })
  }

  const searchByImage = async (imageFile: File): Promise<SearchResult> => {
    const formData = new FormData()
    formData.append("image", imageFile)

    loading.value = true
    try {
      const data = await $fetch<SearchResult>("/api/shop/search/visual", {
        method: "POST",
        body: formData,
      })
      results.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const searchByVoice = async (audioBlob: Blob): Promise<SearchResult> => {
    const formData = new FormData()
    formData.append("audio", audioBlob)

    loading.value = true
    try {
      const data = await $fetch<SearchResult>("/api/shop/search/voice", {
        method: "POST",
        body: formData,
      })
      results.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const naturalLanguageSearch = async (question: string): Promise<{
    answer: string
    products: Product[]
    relatedQuestions: string[]
  }> => {
    loading.value = true
    try {
      return await $fetch("/api/shop/search/natural", {
        method: "POST",
        body: { question },
      })
    } finally {
      loading.value = false
    }
  }

  const compareProducts = async (productIds: string[]): Promise<{
    products: Product[]
    comparison: Record<string, Array<{ productId: string; value: unknown }>>
    aiSummary: string
  }> => {
    return await $fetch("/api/shop/search/compare", {
      method: "POST",
      body: { productIds },
    })
  }

  const fetchTrendingSearches = async (): Promise<void> => {
    try {
      const data = await $fetch<string[]>("/api/shop/search/trending")
      trendingSearches.value = data
    } catch {
      // Ignore errors
    }
  }

  const clearFilters = () => {
    filters.value = {}
  }

  const setFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    filters.value = { ...filters.value, [key]: value }
  }

  const removeFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters.value }
    delete newFilters[key]
    filters.value = newFilters
  }

  const hasActiveFilters = computed(() => Object.keys(filters.value).length > 0)

  return {
    query: computed(() => query.value),
    filters: computed(() => filters.value),
    results: computed(() => results.value),
    loading: computed(() => loading.value),
    searchHistory: computed(() => searchHistory.value),
    trendingSearches: computed(() => trendingSearches.value),
    hasActiveFilters,
    search,
    getSuggestions,
    searchByImage,
    searchByVoice,
    naturalLanguageSearch,
    compareProducts,
    fetchTrendingSearches,
    clearFilters,
    setFilter,
    removeFilter,
  }
}
