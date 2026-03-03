/**
 * Smart suggestions composable for AI Chat Input
 */

export interface Suggestion {
  id: string
  text: string
  type: 'text' | 'command' | 'template' | 'emoji' | 'file' | 'mention'
  description?: string
  icon?: string
  insert?: string
  data?: any
  score?: number
}

export interface SuggestionOptions {
  maxSuggestions?: number
  debounceMs?: number
  enableEmojis?: boolean
  enableCommands?: boolean
  enableTemplates?: boolean
  enableMentions?: boolean
  enableFiles?: boolean
  customProviders?: SuggestionProvider[]
}

export interface SuggestionProvider {
  name: string
  type: Suggestion['type']
  provide: (query: string, context: SuggestionContext) => Promise<Suggestion[]>
}

export interface SuggestionContext {
  cursorPosition: number
  textBeforeCursor: string
  textAfterCursor: string
  currentWord: string
  trigger?: string
}

export function useSmartSuggestions(options: SuggestionOptions = {}) {
  const {
    maxSuggestions = 10,
    debounceMs = 300,
    enableEmojis = true,
    enableCommands = true,
    enableTemplates = true,
    enableMentions = true,
    enableFiles = true,
    customProviders = []
  } = options

  const suggestions = ref<Suggestion[]>([])
  const isLoading = ref(false)
  const isVisible = ref(false)
  const selectedIndex = ref(-1)
  const error = ref<string | null>(null)

  // Built-in suggestion providers
  const providers: SuggestionProvider[] = []

  // Emoji provider
  if (enableEmojis) {
    providers.push({
      name: 'emojis',
      type: 'emoji',
      provide: async (query: string) => {
        if (!query.startsWith(':')) return []
        
        const emojiQuery = query.slice(1)
        const emojis = getEmojis()
        
        return emojis
          .filter(emoji => 
            emoji.keywords.some(keyword => 
              keyword.includes(emojiQuery.toLowerCase())
            )
          )
          .slice(0, 5)
          .map(emoji => ({
            id: `emoji-${emoji.emoji}`,
            text: emoji.emoji,
            type: 'emoji' as const,
            description: emoji.description,
            insert: emoji.emoji,
            score: emoji.keywords.some(k => k === emojiQuery.toLowerCase()) ? 100 : 50
          }))
      }
    })
  }

  // Command provider
  if (enableCommands) {
    providers.push({
      name: 'commands',
      type: 'command',
      provide: async (query: string) => {
        if (!query.startsWith('/')) return []
        
        const commandQuery = query.slice(1)
        const commands = getCommands()
        
        return commands
          .filter(command => 
            command.name.toLowerCase().includes(commandQuery.toLowerCase()) ||
            command.description.toLowerCase().includes(commandQuery.toLowerCase())
          )
          .slice(0, 5)
          .map(command => ({
            id: `command-${command.name}`,
            text: `/${command.name}`,
            type: 'command' as const,
            description: command.description,
            icon: command.icon,
            insert: `/${command.name} `,
            score: command.name.toLowerCase() === commandQuery.toLowerCase() ? 100 : 50
          }))
      }
    })
  }

  // Template provider
  if (enableTemplates) {
    providers.push({
      name: 'templates',
      type: 'template',
      provide: async (query: string) => {
        if (!query.startsWith('#')) return []
        
        const templateQuery = query.slice(1)
        const templates = await getTemplates()
        
        return templates
          .filter(template => 
            template.name.toLowerCase().includes(templateQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(templateQuery.toLowerCase())
          )
          .slice(0, 5)
          .map(template => ({
            id: `template-${template.id}`,
            text: `#${template.name}`,
            type: 'template' as const,
            description: template.description,
            icon: 'layout',
            insert: template.content,
            score: template.name.toLowerCase() === templateQuery.toLowerCase() ? 100 : 50,
            data: template
          }))
      }
    })
  }

  // Mention provider
  if (enableMentions) {
    providers.push({
      name: 'mentions',
      type: 'mention',
      provide: async (query: string) => {
        if (!query.startsWith('@')) return []
        
        const mentionQuery = query.slice(1)
        const users = await getUsers()
        
        return users
          .filter(user => 
            user.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(mentionQuery.toLowerCase())
          )
          .slice(0, 5)
          .map(user => ({
            id: `mention-${user.id}`,
            text: `@${user.username}`,
            type: 'mention' as const,
            description: user.name,
            icon: 'user',
            insert: `@${user.username}`,
            score: user.username.toLowerCase() === mentionQuery.toLowerCase() ? 100 : 50,
            data: user
          }))
      }
    })
  }

  // Add custom providers
  providers.push(...customProviders)

  // Debounced fetch function
  const debouncedFetch = debounce(async (query: string, context: SuggestionContext) => {
    if (!query.trim()) {
      suggestions.value = []
      isVisible.value = false
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const allSuggestions: Suggestion[] = []

      // Fetch from all providers
      for (const provider of providers) {
        try {
          const providerSuggestions = await provider.provide(query, context)
          allSuggestions.push(...providerSuggestions)
        } catch (providerError) {
          console.warn(`Suggestion provider ${provider.name} failed:`, providerError)
        }
      }

      // Sort by score and limit
      suggestions.value = allSuggestions
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, maxSuggestions)

      isVisible.value = suggestions.value.length > 0
      selectedIndex.value = suggestions.value.length > 0 ? 0 : -1
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch suggestions'
      suggestions.value = []
      isVisible.value = false
    } finally {
      isLoading.value = false
    }
  }, debounceMs)

  const getSuggestions = (text: string, cursorPosition: number) => {
    const textBeforeCursor = text.slice(0, cursorPosition)
    const textAfterCursor = text.slice(cursorPosition)
    
    // Find current word and trigger
    const words = textBeforeCursor.split(/\s+/)
    const currentWord = words[words.length - 1] || ''
    
    let trigger: string | undefined
    
    if (currentWord.startsWith(':')) trigger = ':'
    else if (currentWord.startsWith('/')) trigger = '/'
    else if (currentWord.startsWith('#')) trigger = '#'
    else if (currentWord.startsWith('@')) trigger = '@'

    const context: SuggestionContext = {
      cursorPosition,
      textBeforeCursor,
      textAfterCursor,
      currentWord,
      trigger
    }

    // Only fetch if there's a trigger or if we want general text suggestions
    if (trigger) {
      debouncedFetch(currentWord, context)
    } else {
      suggestions.value = []
      isVisible.value = false
    }
  }

  const selectSuggestion = (suggestion: Suggestion) => {
    return suggestion.insert || suggestion.text
  }

  const navigateUp = () => {
    if (selectedIndex.value > 0) {
      selectedIndex.value--
    } else if (suggestions.value.length > 0) {
      selectedIndex.value = suggestions.value.length - 1
    }
  }

  const navigateDown = () => {
    if (selectedIndex.value < suggestions.value.length - 1) {
      selectedIndex.value++
    } else if (suggestions.value.length > 0) {
      selectedIndex.value = 0
    }
  }

  const hideSuggestions = () => {
    isVisible.value = false
    selectedIndex.value = -1
  }

  const showSuggestions = () => {
    if (suggestions.value.length > 0) {
      isVisible.value = true
    }
  }

  return {
    suggestions: readonly(suggestions),
    isLoading: readonly(isLoading),
    isVisible: readonly(isVisible),
    selectedIndex: readonly(selectedIndex),
    error: readonly(error),
    getSuggestions,
    selectSuggestion,
    navigateUp,
    navigateDown,
    hideSuggestions,
    showSuggestions
  }
}

// Helper functions (mock implementations - replace with real data)
function getEmojis() {
  return [
    { emoji: '😊', description: 'Smiling face', keywords: ['smile', 'happy', 'joy'] },
    { emoji: '❤️', description: 'Heart', keywords: ['love', 'heart', 'red'] },
    { emoji: '👍', description: 'Thumbs up', keywords: ['thumbs', 'up', 'good', 'yes'] },
    { emoji: '🎉', description: 'Party popper', keywords: ['party', 'celebration', 'joy'] },
    { emoji: '🤔', description: 'Thinking face', keywords: ['thinking', 'ponder', 'hmm'] },
    { emoji: '😂', description: 'Face with tears', keywords: ['laugh', 'tears', 'funny'] },
    { emoji: '🔥', description: 'Fire', keywords: ['fire', 'hot', 'flame'] },
    { emoji: '✨', description: 'Sparkles', keywords: ['sparkle', 'magic', 'shine'] }
  ]
}

function getCommands() {
  return [
    { name: 'help', description: 'Show available commands', icon: 'help-circle' },
    { name: 'clear', description: 'Clear conversation', icon: 'trash' },
    { name: 'save', description: 'Save conversation', icon: 'save' },
    { name: 'export', description: 'Export conversation', icon: 'download' },
    { name: 'settings', description: 'Open settings', icon: 'settings' },
    { name: 'theme', description: 'Toggle theme', icon: 'moon' }
  ]
}

async function getTemplates() {
  // Mock templates - replace with real API call
  return [
    { id: '1', name: 'meeting', description: 'Meeting notes template', content: '## Meeting Notes\n\n### Attendees:\n- \n\n### Agenda:\n1. \n\n### Action Items:\n- [ ] ' },
    { id: '2', name: 'bug-report', description: 'Bug report template', content: '## Bug Report\n\n### Description:\n\n### Steps to Reproduce:\n1. \n2. \n\n### Expected Behavior:\n\n### Actual Behavior:\n\n### Environment:\n' },
    { id: '3', name: 'code-review', description: 'Code review template', content: '## Code Review\n\n### Overview:\n\n### Positive Points:\n- \n\n### Suggestions:\n- \n\n### Issues:\n- \n' }
  ]
}

async function getUsers() {
  // Mock users - replace with real API call
  return [
    { id: '1', name: 'John Doe', username: 'johndoe' },
    { id: '2', name: 'Jane Smith', username: 'janesmith' },
    { id: '3', name: 'Bob Johnson', username: 'bobjohnson' }
  ]
}
