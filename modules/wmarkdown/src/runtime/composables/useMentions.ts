import type { Ref } from 'vue'

export interface MentionItem {
  id: string
  type: 'page' | 'user' | 'date' | 'block'
  title: string
  subtitle?: string
  icon?: string
  path?: string
  metadata?: Record<string, unknown>
}

export interface UseMentionsOptions {
  /** Debounce time for search in ms */
  debounceMs?: number
  /** Maximum number of results */
  maxResults?: number
  /** Trigger character (default: '@') */
  triggerChar?: string
  /** Custom search function */
  searchFn?: (query: string) => Promise<MentionItem[]> | MentionItem[]
}

export interface UseMentionsReturn {
  /** Whether mention popup is visible */
  isOpen: Ref<boolean>
  /** Current search query */
  query: Ref<string>
  /** Filtered mention items */
  items: Ref<MentionItem[]>
  /** Currently selected index */
  selectedIndex: Ref<number>
  /** Position for popup */
  position: Ref<{ x: number; y: number }>
  /** Initialize mention tracking on an element */
  init: (element: HTMLElement) => void
  /** Destroy mention tracking */
  destroy: () => void
  /** Handle key navigation */
  handleKeyDown: (e: KeyboardEvent) => boolean
  /** Select an item */
  selectItem: (item: MentionItem) => void
  /** Insert mention into content */
  insertMention: (item: MentionItem) => string
  /** Open mention popup */
  open: (pos: { x: number; y: number }) => void
  /** Close mention popup */
  close: () => void
}

/**
 * Composable for @ mentions functionality like Notion
 *
 * @example
 * ```vue
 * <script setup>
 * const { isOpen, items, selectedIndex, init, handleKeyDown, insertMention } = useMentions({
 *   searchFn: async (query) => {
 *     return await $fetch('/api/search', { params: { q: query } })
 *   }
 * })
 *
 * onMounted(() => {
 *   init(editorElement.value)
 * })
 * </script>
 * ```
 */
export function useMentions(options: UseMentionsOptions = {}): UseMentionsReturn {
  const {
    debounceMs = 150,
    maxResults = 10,
    triggerChar = '@',
    searchFn
  } = options

  const isOpen = ref(false)
  const query = ref('')
  const items = ref<MentionItem[]>([])
  const selectedIndex = ref(0)
  const position = ref({ x: 0, y: 0 })

  let editorElement: HTMLElement | null = null
  let currentRange: Range | null = null
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  // Default search function - searches in local pages
  const defaultSearch = async (q: string): Promise<MentionItem[]> => {
    const mockItems: MentionItem[] = [
      { id: '1', type: 'page', title: 'Getting Started', subtitle: '/docs/start', icon: 'lucide:file-text' },
      { id: '2', type: 'page', title: 'API Reference', subtitle: '/docs/api', icon: 'lucide:code' },
      { id: '3', type: 'page', title: 'Changelog', subtitle: '/docs/changelog', icon: 'lucide:history' },
      { id: 'today', type: 'date', title: 'Today', subtitle: new Date().toLocaleDateString(), icon: 'lucide:calendar' },
      { id: 'tomorrow', type: 'date', title: 'Tomorrow', subtitle: 'Next day', icon: 'lucide:calendar' }
    ]

    if (!q) return mockItems.slice(0, maxResults)

    const lowerQ = q.toLowerCase()
    return mockItems
      .filter(item =>
        item.title.toLowerCase().includes(lowerQ) ||
        item.subtitle?.toLowerCase().includes(lowerQ)
      )
      .slice(0, maxResults)
  }

  const performSearch = async (searchQuery: string) => {
    const fn = searchFn || defaultSearch
    const results = await fn(searchQuery)
    items.value = results
    selectedIndex.value = 0
  }

  const debouncedSearch = (searchQuery: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    searchTimeout = setTimeout(() => {
      performSearch(searchQuery)
    }, debounceMs)
  }

  const getCaretPosition = (): { x: number; y: number } => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      return { x: 0, y: 0 }
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    return {
      x: rect.left,
      y: rect.bottom + window.scrollY + 8
    }
  }

  const checkForMention = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    if (!range.collapsed) return

    const textNode = range.startContainer
    if (textNode.nodeType !== Node.TEXT_NODE) return

    const textContent = textNode.textContent || ''
    const cursorPosition = range.startOffset

    // Find trigger character before cursor
    let triggerIndex = -1
    for (let i = cursorPosition - 1; i >= 0; i--) {
      const char = textContent[i]
      if (char === triggerChar) {
        triggerIndex = i
        break
      }
      if (char === ' ' || char === '\n') {
        break
      }
    }

    if (triggerIndex === -1) {
      if (isOpen.value) {
        close()
      }
      return
    }

    // Extract query
    const mentionQuery = textContent.slice(triggerIndex + 1, cursorPosition)
    query.value = mentionQuery

    // Save current range for insertion
    currentRange = range.cloneRange()
    currentRange.setStart(textNode, triggerIndex)
    currentRange.setEnd(textNode, cursorPosition)

    // Open popup
    position.value = getCaretPosition()
    isOpen.value = true

    // Search
    debouncedSearch(mentionQuery)
  }

  const handleInput = () => {
    checkForMention()
  }

  const handleKeyDown = (e: KeyboardEvent): boolean => {
    if (!isOpen.value) return false

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        selectedIndex.value = (selectedIndex.value + 1) % items.value.length
        return true

      case 'ArrowUp':
        e.preventDefault()
        selectedIndex.value = (selectedIndex.value - 1 + items.value.length) % items.value.length
        return true

      case 'Enter':
      case 'Tab':
        e.preventDefault()
        if (items.value[selectedIndex.value]) {
          selectItem(items.value[selectedIndex.value])
        }
        return true

      case 'Escape':
        e.preventDefault()
        close()
        return true

      default:
        return false
    }
  }

  const selectItem = (item: MentionItem) => {
    insertMention(item)
    close()
  }

  const insertMention = (item: MentionItem): string => {
    if (!currentRange) return ''

    const selection = window.getSelection()
    if (!selection) return ''

    // Delete the trigger + query text
    currentRange.deleteContents()

    // Create mention element
    const mentionSpan = document.createElement('span')
    mentionSpan.className = 'wmarkdown-mention'
    mentionSpan.contentEditable = 'false'
    mentionSpan.dataset.mentionId = item.id
    mentionSpan.dataset.mentionType = item.type

    // Different styling based on type
    const typeColors: Record<string, string> = {
      page: '#3b82f6',
      user: '#10b981',
      date: '#f59e0b',
      block: '#8b5cf6'
    }

    mentionSpan.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 4px;
      background: ${typeColors[item.type] || '#3b82f6'}15;
      color: ${typeColors[item.type] || '#3b82f6'};
      font-weight: 500;
      cursor: pointer;
      user-select: none;
    `

    // Add icon if available
    if (item.icon) {
      const iconSpan = document.createElement('span')
      iconSpan.className = 'mention-icon'
      iconSpan.textContent = item.type === 'page' ? '📄' :
                              item.type === 'user' ? '👤' :
                              item.type === 'date' ? '📅' : '🔗'
      mentionSpan.appendChild(iconSpan)
    }

    // Add text
    const textSpan = document.createElement('span')
    textSpan.textContent = item.title
    mentionSpan.appendChild(textSpan)

    // Insert mention
    currentRange.insertNode(mentionSpan)

    // Add space after mention
    const spaceNode = document.createTextNode('\u00A0')
    mentionSpan.after(spaceNode)

    // Move cursor after space
    const newRange = document.createRange()
    newRange.setStartAfter(spaceNode)
    newRange.setEndAfter(spaceNode)
    selection.removeAllRanges()
    selection.addRange(newRange)

    return mentionSpan.outerHTML
  }

  const open = (pos: { x: number; y: number }) => {
    position.value = pos
    isOpen.value = true
    performSearch('')
  }

  const close = () => {
    isOpen.value = false
    query.value = ''
    items.value = []
    selectedIndex.value = 0
    currentRange = null
  }

  const init = (element: HTMLElement) => {
    editorElement = element
    editorElement.addEventListener('input', handleInput)
    editorElement.addEventListener('keyup', handleInput)

    // Handle clicks outside to close
    document.addEventListener('click', (e) => {
      if (isOpen.value && !editorElement?.contains(e.target as Node)) {
        close()
      }
    })
  }

  const destroy = () => {
    if (editorElement) {
      editorElement.removeEventListener('input', handleInput)
      editorElement.removeEventListener('keyup', handleInput)
    }
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
  }

  return {
    isOpen: readonly(isOpen),
    query: readonly(query),
    items: readonly(items),
    selectedIndex: readonly(selectedIndex),
    position: readonly(position),
    init,
    destroy,
    handleKeyDown,
    selectItem,
    insertMention,
    open,
    close
  }
}
