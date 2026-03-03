import { ref, computed } from 'vue'

export interface ResearchSource {
  id: string
  title: string
  url: string
  type: 'paper' | 'article' | 'book' | 'website' | 'video'
  authors: string[]
  publishDate?: Date
  abstract?: string
  tags: string[]
  relevanceScore?: number
}

export function useResearchSources() {
  const sources = ref<ResearchSource[]>([])
  const searchQuery = ref('')
  const selectedTags = ref<string[]>([])
  const loading = ref(false)

  const filteredSources = computed(() => {
    let filtered = sources.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(source => 
        source.title.toLowerCase().includes(query) ||
        source.authors.some(author => author.toLowerCase().includes(query)) ||
        source.abstract?.toLowerCase().includes(query)
      )
    }

    if (selectedTags.value.length > 0) {
      filtered = filtered.filter(source =>
        selectedTags.value.some(tag => source.tags.includes(tag))
      )
    }

    return filtered.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
  })

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    sources.value.forEach(source => {
      source.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })

  const addSource = (source: Omit<ResearchSource, 'id'>) => {
    const newSource: ResearchSource = {
      ...source,
      id: crypto.randomUUID()
    }
    sources.value.push(newSource)
    return newSource
  }

  const removeSource = (id: string) => {
    const index = sources.value.findIndex(source => source.id === id)
    if (index > -1) {
      sources.value.splice(index, 1)
    }
  }

  const updateRelevanceScore = (id: string, score: number) => {
    const source = sources.value.find(s => s.id === id)
    if (source) {
      source.relevanceScore = score
    }
  }

  return {
    sources,
    searchQuery,
    selectedTags,
    loading,
    filteredSources,
    allTags,
    addSource,
    removeSource,
    updateRelevanceScore
  }
}
