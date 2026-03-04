import { ref, computed } from 'vue'
import Fuse from 'fuse.js'

interface SearchDocument {
  id: string
  title: string
  content: string
  path: string
  tags?: string[]
  frontmatter?: Record<string, unknown>
}

interface SmartSearchOptions {
  fuzzy?: boolean
  semantic?: boolean
  minMatchCharLength?: number
  threshold?: number
  includeScore?: boolean
  includeMatches?: boolean
}

interface SearchResult {
  item: SearchDocument
  score: number
  matches: Array<{
    indices: number[][]
    key: string
    value: string
  }>
}

interface SearchState {
  query: string
  results: SearchResult[]
  isSearching: boolean
  recentSearches: string[]
}

export function useSmartSearch(documents: SearchDocument[], options: SmartSearchOptions = {}) {
  const state = ref<SearchState>({
    query: '',
    results: [],
    isSearching: false,
    recentSearches: []
  })

  const fuseOptions = {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'content', weight: 0.3 },
      { name: 'tags', weight: 0.2 },
      { name: 'path', weight: 0.1 }
    ],
    threshold: options.threshold ?? 0.4,
    minMatchCharLength: options.minMatchCharLength ?? 3,
    includeScore: options.includeScore ?? true,
    includeMatches: options.includeMatches ?? true,
    useExtendedSearch: true,
    ignoreLocation: false,
    findAllMatches: true,
    distance: 100
  }

  const fuse = new Fuse(documents, fuseOptions)

  const search = (query: string): SearchResult[] => {
    if (!query.trim()) {
      state.value.results = []
      return []
    }

    state.value.isSearching = true
    state.value.query = query

    // Add to recent searches
    if (!state.value.recentSearches.includes(query)) {
      state.value.recentSearches.unshift(query)
      if (state.value.recentSearches.length > 10) {
        state.value.recentSearches.pop()
      }
    }

    // Fuzzy search
    let results = fuse.search(query) as SearchResult[]

    // Semantic-like ranking (boost exact matches)
    results = results.map(result => {
      const item = result.item
      const lowerQuery = query.toLowerCase()

      // Check for exact matches in title
      if (item.title.toLowerCase().includes(lowerQuery)) {
        result.score *= 0.5 // Boost
      }

      // Check for exact matches in content
      if (item.content.toLowerCase().includes(lowerQuery)) {
        result.score *= 0.8 // Slight boost
      }

      return result
    })

    // Sort by score (lower is better for Fuse.js)
    results.sort((a, b) => a.score - b.score)

    state.value.results = results
    state.value.isSearching = false

    return results
  }

  const searchByTag = (tag: string): SearchResult[] => {
    const filtered = documents.filter(doc =>
      doc.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
    )

    return filtered.map(doc => ({
      item: doc,
      score: 0,
      matches: []
    }))
  }

  const searchByPath = (path: string): SearchResult[] => {
    const filtered = documents.filter(doc =>
      doc.path.toLowerCase().includes(path.toLowerCase())
    )

    return filtered.map(doc => ({
      item: doc,
      score: 0,
      matches: []
    }))
  }

  const advancedSearch = (params: {
    query?: string
    tags?: string[]
    path?: string
    frontmatter?: Record<string, string>
  }): SearchResult[] => {
    let results = documents.map(doc => ({
      item: doc,
      score: 0,
      matches: []
    }))

    // Filter by query
    if (params.query) {
      results = fuse.search(params.query) as SearchResult[]
    }

    // Filter by tags
    if (params.tags?.length) {
      results = results.filter(result =>
        params.tags!.some(tag =>
          result.item.tags?.some(t =>
            t.toLowerCase() === tag.toLowerCase()
          )
        )
      )
    }

    // Filter by path
    if (params.path) {
      results = results.filter(result =>
        result.item.path.toLowerCase().includes(params.path!.toLowerCase())
      )
    }

    // Filter by frontmatter
    if (params.frontmatter) {
      results = results.filter(result => {
        const fm = result.item.frontmatter || {}
        return Object.entries(params.frontmatter!).every(([key, value]) => {
          const fmValue = fm[key]
          return String(fmValue).toLowerCase() === value.toLowerCase()
        })
      })
    }

    state.value.results = results
    return results
  }

  const clearSearch = () => {
    state.value.query = ''
    state.value.results = []
  }

  const clearRecentSearches = () => {
    state.value.recentSearches = []
  }

  const getSuggestions = (partial: string, maxResults = 5): string[] => {
    if (partial.length < 2) return []

    const suggestions = new Set<string>()

    // Search for matching titles
    documents.forEach(doc => {
      if (doc.title.toLowerCase().includes(partial.toLowerCase())) {
        suggestions.add(doc.title)
      }
    })

    // Search for matching tags
    documents.forEach(doc => {
      doc.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(partial.toLowerCase())) {
          suggestions.add(`tag:${tag}`)
        }
      })
    })

    return Array.from(suggestions).slice(0, maxResults)
  }

  const highlightMatches = (text: string, query: string): string => {
    if (!query) return text

    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi')
    return text.replace(regex, '<mark class="search-highlight">$1</mark>')
  }

  const getSearchStats = computed(() => {
    return {
      totalDocuments: documents.length,
      resultCount: state.value.results.length,
      hasResults: state.value.results.length > 0,
      isEmpty: state.value.query.length > 0 && state.value.results.length === 0
    }
  })

  return {
    state,
    search,
    searchByTag,
    searchByPath,
    advancedSearch,
    clearSearch,
    clearRecentSearches,
    getSuggestions,
    highlightMatches,
    searchStats: getSearchStats
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
