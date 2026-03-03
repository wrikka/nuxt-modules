import { ref, computed } from 'vue'

export interface KbSource {
  id: string
  name: string
  type: 'document' | 'database' | 'api' | 'file'
  url?: string
  description?: string
  isActive: boolean
}

export function useKbSources() {
  const sources = ref<KbSource[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const activeSources = computed(() => 
    sources.value.filter(source => source.isActive)
  )

  const sourcesByType = computed(() => {
    const grouped = sources.value.reduce((acc, source) => {
      if (!acc[source.type]) {
        acc[source.type] = []
      }
      acc[source.type].push(source)
      return acc
    }, {} as Record<string, KbSource[]>)
    
    return grouped
  })

  const addSource = (source: Omit<KbSource, 'id'>) => {
    const newSource: KbSource = {
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

  const toggleSource = (id: string) => {
    const source = sources.value.find(s => s.id === id)
    if (source) {
      source.isActive = !source.isActive
    }
  }

  return {
    sources,
    loading,
    error,
    activeSources,
    sourcesByType,
    addSource,
    removeSource,
    toggleSource
  }
}
