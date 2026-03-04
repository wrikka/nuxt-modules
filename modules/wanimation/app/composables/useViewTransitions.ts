import { useEventListener, useThrottleFn } from '@vueuse/core'

export interface ViewTransitionOptions {
  duration?: number
  easing?: string
  direction?: 'forward' | 'backward'
  type?: 'slide' | 'fade' | 'scale' | 'flip'
}

export const useViewTransitions = () => {
  const isSupported = typeof document !== 'undefined' && 'startViewTransition' in document

  const transition = async (
    callback: () => Promise<void> | void,
    options: ViewTransitionOptions = {}
  ): Promise<void> => {
    const { type = 'fade', duration = 300 } = options

    if (!isSupported) {
      await callback()
      return
    }

    const doc = document as unknown as {
      startViewTransition: (callback: () => Promise<void> | void) => { finished: Promise<void> }
    }

    // Apply custom styles for the transition
    const styleId = 'view-transition-styles'
    let styleEl = document.getElementById(styleId)

    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }

    const getTransitionCSS = () => {
      switch (type) {
        case 'slide':
          return `
            ::view-transition-old(root) {
              animation: slide-out ${duration}ms ease-in-out;
            }
            ::view-transition-new(root) {
              animation: slide-in ${duration}ms ease-in-out;
            }
            @keyframes slide-out {
              to { transform: translateX(-100%); }
            }
            @keyframes slide-in {
              from { transform: translateX(100%); }
            }
          `
        case 'scale':
          return `
            ::view-transition-old(root) {
              animation: scale-out ${duration}ms ease-in-out;
            }
            ::view-transition-new(root) {
              animation: scale-in ${duration}ms ease-in-out;
            }
            @keyframes scale-out {
              to { transform: scale(0.8); opacity: 0; }
            }
            @keyframes scale-in {
              from { transform: scale(1.2); opacity: 0; }
            }
          `
        case 'flip':
          return `
            ::view-transition-old(root) {
              animation: flip-out ${duration}ms ease-in-out;
            }
            ::view-transition-new(root) {
              animation: flip-in ${duration}ms ease-in-out;
            }
            @keyframes flip-out {
              to { transform: rotateY(90deg); opacity: 0; }
            }
            @keyframes flip-in {
              from { transform: rotateY(-90deg); opacity: 0; }
            }
          `
        default:
          return `
            ::view-transition-old(root),
            ::view-transition-new(root) {
              animation-duration: ${duration}ms;
            }
          `
      }
    }

    styleEl.textContent = getTransitionCSS()

    const transition = doc.startViewTransition(async () => {
      await callback()
    })

    await transition.finished

    // Clean up
    styleEl.remove()
  }

  const pageTransition = (
    options: ViewTransitionOptions = {}
  ): { before: () => void; after: () => Promise<void> } => {
    let transitionFn: (() => Promise<void> | void) | null = null

    return {
      before: () => {
        // Capture current state
      },
      after: async () => {
        if (transitionFn) {
          await transition(transitionFn, options)
        }
      },
    }
  }

  const elementTransition = async (
    element: Element | string,
    newContent: string,
    options: ViewTransitionOptions = {}
  ): Promise<void> => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof Element)) return

    // Assign view transition name
    const transitionName = `transition-${Math.random().toString(36).substr(2, 9)}`
    ;(el as HTMLElement).style.viewTransitionName = transitionName

    await transition(() => {
      el.innerHTML = newContent
    }, options)

    ;(el as HTMLElement).style.viewTransitionName = ''
  }

  return {
    isSupported,
    transition,
    pageTransition,
    elementTransition,
  }
}
