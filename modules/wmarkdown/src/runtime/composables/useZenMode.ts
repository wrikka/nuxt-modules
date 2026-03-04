import { ref, computed, onMounted, onUnmounted } from 'vue'

interface ZenModeOptions {
  fontSize?: 'small' | 'medium' | 'large'
  fontFamily?: 'sans' | 'serif' | 'mono'
  lineHeight?: 'compact' | 'normal' | 'relaxed'
  showWordCount?: boolean
  showReadingTime?: boolean
  typewriterMode?: boolean
  hideUI?: boolean
}

export function useZenMode(options: ZenModeOptions = {}) {
  const isZenMode = ref(false)
  const settings = ref<ZenModeOptions>({
    fontSize: 'medium',
    fontFamily: 'sans',
    lineHeight: 'normal',
    showWordCount: true,
    showReadingTime: true,
    typewriterMode: false,
    hideUI: true,
    ...options
  })

  const cursorPosition = ref({ x: 0, y: 0 })
  const editorElement = ref<HTMLElement | null>(null)

  const toggleZenMode = () => {
    isZenMode.value = !isZenMode.value

    if (typeof document !== 'undefined') {
      if (isZenMode.value) {
        document.body.classList.add('zen-mode')
        enterFullscreen()
      } else {
        document.body.classList.remove('zen-mode')
        exitFullscreen()
      }
    }
  }

  const enterZenMode = () => {
    if (!isZenMode.value) {
      toggleZenMode()
    }
  }

  const exitZenMode = () => {
    if (isZenMode.value) {
      toggleZenMode()
    }
  }

  const enterFullscreen = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.requestFullscreen?.().catch(() => {
        // Ignore fullscreen errors
      })
    }
  }

  const exitFullscreen = () => {
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen?.()
    }
  }

  const updateSettings = (newSettings: Partial<ZenModeOptions>) => {
    Object.assign(settings.value, newSettings)
  }

  // Typewriter mode: keep cursor in center of screen
  const handleScroll = () => {
    if (!settings.value.typewriterMode || !editorElement.value) return

    const selection = window.getSelection()
    if (!selection?.rangeCount) return

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const editor = editorElement.value

    const editorRect = editor.getBoundingClientRect()
    const cursorY = rect.top - editorRect.top + editor.scrollTop

    // Center the cursor vertically
    const centerOffset = editor.clientHeight / 2
    editor.scrollTop = cursorY - centerOffset
  }

  const bindEditor = (element: HTMLElement) => {
    editorElement.value = element

    if (settings.value.typewriterMode) {
      element.addEventListener('keyup', handleScroll)
      element.addEventListener('click', handleScroll)
    }
  }

  const unbindEditor = () => {
    if (editorElement.value) {
      editorElement.value.removeEventListener('keyup', handleScroll)
      editorElement.value.removeEventListener('click', handleScroll)
      editorElement.value = null
    }
  }

  // CSS classes based on settings
  const zenClasses = computed(() => {
    const classes = ['zen-mode-container']

    if (settings.value.fontSize) {
      classes.push(`zen-font-${settings.value.fontSize}`)
    }
    if (settings.value.fontFamily) {
      classes.push(`zen-font-${settings.value.fontFamily}`)
    }
    if (settings.value.lineHeight) {
      classes.push(`zen-line-${settings.value.lineHeight}`)
    }
    if (settings.value.typewriterMode) {
      classes.push('zen-typewriter')
    }

    return classes.join(' ')
  })

  // Keyboard shortcuts
  const handleKeyDown = (event: KeyboardEvent) => {
    // Ctrl/Cmd + Shift + Z to toggle
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'z') {
      event.preventDefault()
      toggleZenMode()
      return
    }

    // Escape to exit
    if (event.key === 'Escape' && isZenMode.value) {
      exitZenMode()
      return
    }

    // Settings shortcuts in zen mode
    if (isZenMode.value) {
      // Ctrl + = to increase font size
      if ((event.metaKey || event.ctrlKey) && event.key === '=') {
        event.preventDefault()
        const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large']
        const currentIndex = sizes.indexOf(settings.value.fontSize || 'medium')
        if (currentIndex < sizes.length - 1) {
          settings.value.fontSize = sizes[currentIndex + 1]
        }
      }

      // Ctrl + - to decrease font size
      if ((event.metaKey || event.ctrlKey) && event.key === '-') {
        event.preventDefault()
        const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large']
        const currentIndex = sizes.indexOf(settings.value.fontSize || 'medium')
        if (currentIndex > 0) {
          settings.value.fontSize = sizes[currentIndex - 1]
        }
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    unbindEditor()
    if (isZenMode.value) {
      exitZenMode()
    }
  })

  return {
    isZenMode,
    settings,
    zenClasses,
    toggleZenMode,
    enterZenMode,
    exitZenMode,
    updateSettings,
    bindEditor,
    unbindEditor
  }
}
