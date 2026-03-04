import { onMounted, onUnmounted, readonly, ref } from 'vue'

export interface KeyboardHint {
  key: string
  description: string
  category: string
}

/**
 * Keyboard Hint Overlay - Show shortcut help overlay
 */
export function useKeyboardHintOverlay() {
  const isVisible = ref(false)

  const defaultHints: KeyboardHint[] = [
    { key: '↑ ↓', description: 'Navigate items', category: 'Navigation' },
    { key: '↵', description: 'Execute command', category: 'Navigation' },
    { key: 'Esc', description: 'Close palette', category: 'Navigation' },
    { key: '⌘K', description: 'Open palette', category: 'General' },
    { key: 'Tab', description: 'Next field', category: 'Navigation' },
    { key: '⇧Tab', description: 'Previous field', category: 'Navigation' },
    { key: '⌘+', description: 'Pin command', category: 'Actions' },
    { key: '⌘⇧', description: 'Multi-select', category: 'Actions' }
  ]

  const customHints = ref<KeyboardHint[]>([])

  const showOverlay = () => {
    isVisible.value = true
  }

  const hideOverlay = () => {
    isVisible.value = false
  }

  const toggleOverlay = () => {
    isVisible.value = !isVisible.value
  }

  const addCustomHint = (hint: KeyboardHint) => {
    customHints.value.push(hint)
  }

  const getAllHints = () => {
    return [...defaultHints, ...customHints.value]
  }

  const getHintsByCategory = () => {
    const allHints = getAllHints()
    const categories: Record<string, KeyboardHint[]> = {}

    for (const hint of allHints) {
      if (!categories[hint.category]) {
        categories[hint.category] = []
      }
      categories[hint.category].push(hint)
    }

    return categories
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === '?' && !event.shiftKey) {
      event.preventDefault()
      toggleOverlay()
    }
    else if (event.key === 'Escape' && isVisible.value) {
      hideOverlay()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  return {
    isVisible: readonly(isVisible),
    defaultHints,
    customHints: readonly(customHints),
    showOverlay,
    hideOverlay,
    toggleOverlay,
    addCustomHint,
    getAllHints,
    getHintsByCategory,
    handleKeyDown
  }
}
