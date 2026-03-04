import { ref, computed } from 'vue'
import type { ChatMessage } from '../types/chat'

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  updatedAt: Date
}

export interface SearchResult {
  conversationId: string
  conversationTitle: string
  message: ChatMessage
  matchType: 'title' | 'content'
  highlightText: string
}

export function useChatSearch(conversations: Conversation[]) {
  const searchQuery = ref('')
  const isSearching = ref(false)
  const searchResults = ref<SearchResult[]>([])

  const hasSearchQuery = computed(() => searchQuery.value.trim().length > 0)

  const performSearch = () => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) {
      searchResults.value = []
      isSearching.value = false
      return
    }

    isSearching.value = true
    const results: SearchResult[] = []

    conversations.forEach(conversation => {
      if (conversation.title.toLowerCase().includes(query)) {
        conversation.messages.forEach(message => {
          results.push({
            conversationId: conversation.id,
            conversationTitle: conversation.title,
            message,
            matchType: 'title',
            highlightText: highlightMatch(conversation.title, query)
          })
        })
      }

      conversation.messages.forEach(message => {
        if (message.content.toLowerCase().includes(query)) {
          results.push({
            conversationId: conversation.id,
            conversationTitle: conversation.title,
            message,
            matchType: 'content',
            highlightText: highlightMatch(message.content, query)
          })
        }
      })
    })

    searchResults.value = results
  }

  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    isSearching.value = false
  }

  const highlightMatch = (text: string, query: string): string => {
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  const filteredConversations = computed(() => {
    if (!hasSearchQuery.value) return conversations
    const conversationIds = new Set(searchResults.value.map(r => r.conversationId))
    return conversations.filter(c => conversationIds.has(c.id))
  })

  return {
    searchQuery,
    isSearching,
    searchResults,
    hasSearchQuery,
    performSearch,
    clearSearch,
    filteredConversations
  }
}
