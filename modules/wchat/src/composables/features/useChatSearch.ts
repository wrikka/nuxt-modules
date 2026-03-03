import { ref, computed } from 'vue'
import type { ChatSearchResult, ChatFilter, ChatMessage, ChatSession } from '../../types/domain'

export function useChatSearch() {
  const searchQuery = ref('')
  const searchResults = ref<ChatSearchResult[]>([])
  const isSearching = ref(false)
  const searchFilter = ref<ChatFilter>({})

  const hasResults = computed(() => searchResults.value.length > 0)
  const resultCount = computed(() => searchResults.value.length)

  async function searchMessages(query: string, filter?: ChatFilter) {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    isSearching.value = true
    searchQuery.value = query
    if (filter) {
      searchFilter.value = filter
    }

    try {
      const results = await $fetch<ChatSearchResult[]>('/api/search/messages', {
        method: 'POST',
        body: {
          query,
          filter: searchFilter.value
        }
      })

      searchResults.value = results
    } catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }

  function highlightText(text: string, query: string): string {
    if (!query.trim()) return text

    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  function getContextAroundMessage(message: ChatMessage, allMessages: ChatMessage[], contextSize: number = 2): {
    before: ChatMessage[]
    after: ChatMessage[]
  } {
    const messageIndex = allMessages.findIndex(m => m.id === message.id)
    if (messageIndex === -1) return { before: [], after: [] }

    const before = allMessages.slice(Math.max(0, messageIndex - contextSize), messageIndex)
    const after = allMessages.slice(messageIndex + 1, messageIndex + 1 + contextSize)

    return { before, after }
  }

  async function searchInSession(sessionId: string, query: string) {
    try {
      const session = await $fetch<ChatSession>(`/api/sessions/${sessionId}`)
      const results: ChatSearchResult[] = []

      session.messages.forEach(message => {
        if (message.content.toLowerCase().includes(query.toLowerCase())) {
          const { before, after } = getContextAroundMessage(message, session.messages)

          results.push({
            message,
            sessionId,
            sessionTitle: session.title,
            relevance: calculateRelevance(message.content, query),
            context: {
              before: before.map(m => m.content).join(' '),
              after: after.map(m => m.content).join(' ')
            }
          })
        }
      })

      // Sort by relevance
      results.sort((a, b) => b.relevance - a.relevance)
      searchResults.value = results

    } catch (error) {
      console.error('Error searching in session:', error)
    }
  }

  function calculateRelevance(content: string, query: string): number {
    const contentLower = content.toLowerCase()
    const queryLower = query.toLowerCase()

    let relevance = 0

    // Exact match gets highest score
    if (contentLower === queryLower) {
      relevance += 100
    }

    // Contains query gets base score
    if (contentLower.includes(queryLower)) {
      relevance += 50
    }

    // Word matches
    const queryWords = queryLower.split(' ')
    const contentWords = contentLower.split(' ')

    queryWords.forEach(queryWord => {
      const matches = contentWords.filter(word => word.includes(queryWord)).length
      relevance += matches * 10
    })

    return relevance
  }

  function clearSearch() {
    searchQuery.value = ''
    searchResults.value = []
    searchFilter.value = {}
  }

  async function searchByDateRange(startDate: Date, endDate: Date) {
    const filter: ChatFilter = {
      ...searchFilter.value,
      dateRange: {
        start: startDate,
        end: endDate
      }
    }

    return searchMessages(searchQuery.value, filter)
  }

  async function searchByParticipants(participants: string[]) {
    const filter: ChatFilter = {
      ...searchFilter.value,
      participants
    }

    return searchMessages(searchQuery.value, filter)
  }

  function getSearchSuggestions(query: string): string[] {
    // สามารถ implement จากประวัติการค้นหาหรือคำที่พบบ่อย
    const commonSearches = [
      'help',
      'error',
      'how to',
      'example',
      'code',
      'function',
      'issue',
      'problem'
    ]

    return commonSearches.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    )
  }

  return {
    // State
    searchQuery,
    searchResults,
    isSearching,
    searchFilter,
    hasResults,
    resultCount,

    // Actions
    searchMessages,
    searchInSession,
    highlightText,
    clearSearch,
    searchByDateRange,
    searchByParticipants,
    getSearchSuggestions,
    getContextAroundMessage
  }
}
