import { ref, computed } from 'vue'

interface Slide {
  id: string
  title: string
  content: string
  notes?: string
  layout: 'title' | 'content' | 'split' | 'image'
}

interface PresentationOptions {
  theme?: 'default' | 'dark' | 'light'
  transition?: 'none' | 'fade' | 'slide' | 'zoom'
}

export function usePresentationMode(options: PresentationOptions = {}) {
  const slides = ref<Slide[]>([])
  const currentIndex = ref(0)
  const isPresenting = ref(false)
  const speakerNotesVisible = ref(false)

  const currentSlide = computed(() => slides.value[currentIndex.value] || null)
  const totalSlides = computed(() => slides.value.length)
  const canGoNext = computed(() => currentIndex.value < slides.value.length - 1)
  const canGoPrevious = computed(() => currentIndex.value > 0)
  const progress = computed(() => {
    if (slides.value.length === 0) return 0
    return ((currentIndex.value + 1) / slides.value.length) * 100
  })

  const fromMarkdown = (markdown: string) => {
    const lines = markdown.split('\n')
    const newSlides: Slide[] = []
    let currentSlide: Partial<Slide> | null = null
    let contentBuffer: string[] = []

    const flushSlide = () => {
      if (currentSlide && contentBuffer.length > 0) {
        newSlides.push({
          id: generateId(),
          title: currentSlide.title || 'Untitled',
          content: contentBuffer.join('\n'),
          notes: currentSlide.notes,
          layout: currentSlide.layout || 'content'
        })
      }
      contentBuffer = []
    }

    for (const line of lines) {
      // Slide separator (horizontal rule or ---)
      if (line.match(/^---\s*$/)) {
        flushSlide()
        currentSlide = { layout: 'content' }
        continue
      }

      // Title slide: # Title
      if (line.match(/^#\s+(.+)$/)) {
        flushSlide()
        currentSlide = {
          title: line.replace(/^#\s+/, ''),
          layout: 'title'
        }
        continue
      }

      // Notes: <!-- Note: ... -->
      const noteMatch = line.match(/<!--\s*[Nn]ote:\s*(.+)-->/)
      if (noteMatch && currentSlide) {
        currentSlide.notes = noteMatch[1]
        continue
      }

      // Regular content
      if (line.trim()) {
        contentBuffer.push(line)
      }
    }

    flushSlide()
    slides.value = newSlides
    currentIndex.value = 0
  }

  const toMarkdown = (): string => {
    return slides.value.map(slide => {
      let md = `---\n\n# ${slide.title}\n\n${slide.content}`
      if (slide.notes) {
        md += `\n\n<!-- Note: ${slide.notes} -->`
      }
      return md
    }).join('\n\n')
  }

  const next = () => {
    if (canGoNext.value) {
      currentIndex.value++
    }
  }

  const previous = () => {
    if (canGoPrevious.value) {
      currentIndex.value--
    }
  }

  const goTo = (index: number) => {
    if (index >= 0 && index < slides.value.length) {
      currentIndex.value = index
    }
  }

  const startPresentation = () => {
    isPresenting.value = true
    currentIndex.value = 0
    if (typeof document !== 'undefined') {
      document.body.requestFullscreen?.()
    }
  }

  const exitPresentation = () => {
    isPresenting.value = false
    if (typeof document !== 'undefined') {
      document.exitFullscreen?.()
    }
  }

  const toggleSpeakerNotes = () => {
    speakerNotesVisible.value = !speakerNotesVisible.value
  }

  const addSlide = (title: string, content: string, layout: Slide['layout'] = 'content'): Slide => {
    const slide: Slide = {
      id: generateId(),
      title,
      content,
      layout
    }
    slides.value.push(slide)
    return slide
  }

  const removeSlide = (index: number): boolean => {
    if (index < 0 || index >= slides.value.length) return false
    slides.value.splice(index, 1)
    if (currentIndex.value >= slides.value.length) {
      currentIndex.value = Math.max(0, slides.value.length - 1)
    }
    return true
  }

  const reorderSlides = (fromIndex: number, toIndex: number): boolean => {
    if (fromIndex < 0 || fromIndex >= slides.value.length) return false
    if (toIndex < 0 || toIndex >= slides.value.length) return false

    const [moved] = slides.value.splice(fromIndex, 1)
    slides.value.splice(toIndex, 0, moved)

    // Update current index if needed
    if (currentIndex.value === fromIndex) {
      currentIndex.value = toIndex
    } else if (fromIndex < toIndex && currentIndex.value > fromIndex && currentIndex.value <= toIndex) {
      currentIndex.value--
    } else if (fromIndex > toIndex && currentIndex.value >= toIndex && currentIndex.value < fromIndex) {
      currentIndex.value++
    }

    return true
  }

  // Keyboard navigation
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isPresenting.value) return

    switch (event.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        event.preventDefault()
        next()
        break
      case 'ArrowLeft':
      case 'PageUp':
        event.preventDefault()
        previous()
        break
      case 'Escape':
        event.preventDefault()
        exitPresentation()
        break
      case 'n':
        toggleSpeakerNotes()
        break
    }
  }

  return {
    slides,
    currentSlide,
    currentIndex,
    totalSlides,
    isPresenting,
    speakerNotesVisible,
    canGoNext,
    canGoPrevious,
    progress,
    fromMarkdown,
    toMarkdown,
    next,
    previous,
    goTo,
    startPresentation,
    exitPresentation,
    toggleSpeakerNotes,
    addSlide,
    removeSlide,
    reorderSlides,
    handleKeyDown
  }
}

function generateId(): string {
  return 'slide-' + Math.random().toString(36).substr(2, 9)
}
