import { onMounted, onUnmounted, readonly, ref } from 'vue'

export interface FocusTrapState {
  isActive: boolean
  previousFocus: HTMLElement | null
}

/**
 * Focus Trap - Trap focus within palette when open
 */
export function useFocusTrap(containerRef?: { value: HTMLElement | null }) {
  const state = ref<FocusTrapState>({
    isActive: false,
    previousFocus: null
  })

  const focusableElements = ref<HTMLElement[]>([])

  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const selector = [
      'button',
      'a[href]',
      'input',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ')

    return Array.from(container.querySelectorAll(selector))
      .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')) as HTMLElement[]
  }

  const activate = () => {
    if (!containerRef?.value) return

    state.value.previousFocus = document.activeElement as HTMLElement
    state.value.isActive = true

    focusableElements.value = getFocusableElements(containerRef.value)

    if (focusableElements.value.length > 0) {
      focusableElements.value[0].focus()
    }
  }

  const deactivate = () => {
    state.value.isActive = false
    if (state.value.previousFocus) {
      state.value.previousFocus.focus()
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!state.value.isActive || event.key !== 'Tab') return

    const elements = focusableElements.value
    if (elements.length === 0) return

    const firstElement = elements[0]
    const lastElement = elements[elements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    }
    else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  return {
    state: readonly(state),
    focusableElements: readonly(focusableElements),
    activate,
    deactivate,
    handleKeyDown
  }
}
