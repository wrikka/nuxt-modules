import anime from 'animejs'

interface FlipState {
  element: Element
  first: DOMRect
  last: DOMRect
}

interface FlipOptions {
  duration?: number
  easing?: string
  stagger?: number
  onComplete?: () => void
}

export const useLayoutTransition = () => {
  const states = new WeakMap<Element, DOMRect>()

  const read = (element: Element | string): DOMRect | null => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el) return null

    const rect = el.getBoundingClientRect()
    states.set(el, rect)
    return rect
  }

  const readAll = (elements: (Element | string)[]): Map<Element, DOMRect> => {
    const map = new Map<Element, DOMRect>()
    for (const element of elements) {
      const rect = read(element)
      if (rect) {
        const el = typeof element === 'string'
          ? document.querySelector(element)!
          : element
        map.set(el, rect)
      }
    }
    return map
  }

  const play = (
    element: Element | string,
    options: FlipOptions = {}
  ): anime.AnimeInstance | null => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el) return null

    const first = states.get(el)
    if (!first) return null

    const last = el.getBoundingClientRect()
    const deltaX = first.left - last.left
    const deltaY = first.top - last.top
    const deltaW = first.width / last.width
    const deltaH = first.height / last.height

    // Reset the state
    states.delete(el)

    if (deltaX === 0 && deltaY === 0 && deltaW === 1 && deltaH === 1) {
      return null
    }

    const { duration = 300, easing = 'easeOutQuad' } = options

    // Apply the inverse transform
    anime.set(el, {
      translateX: deltaX,
      translateY: deltaY,
      scaleX: deltaW,
      scaleH: deltaH,
      transformOrigin: 'top left',
    })

    return anime({
      targets: el,
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      duration,
      easing,
      complete: options.onComplete,
    })
  }

  const playAll = (
    options: FlipOptions = {}
  ): anime.AnimeInstance[] => {
    const results: anime.AnimeInstance[] = []
    const allStates = new Map(states)
    states = new WeakMap()

    for (const [el, first] of allStates) {
      if (!document.contains(el)) continue

      const last = el.getBoundingClientRect()
      const deltaX = first.left - last.left
      const deltaY = first.top - last.top

      if (deltaX !== 0 || deltaY !== 0) {
        anime.set(el, {
          translateX: deltaX,
          translateY: deltaY,
        })

        const anim = anime({
          targets: el,
          translateX: 0,
          translateY: 0,
          duration: options.duration || 300,
          easing: options.easing || 'easeOutQuad',
          delay: options.stagger ? anime.stagger(options.stagger) : 0,
        })

        results.push(anim)
      }
    }

    if (options.onComplete && results.length > 0) {
      results[results.length - 1].complete = options.onComplete
    }

    return results
  }

  const flip = async (
    callback: () => Promise<void> | void,
    options: FlipOptions = {}
  ): Promise<void> => {
    // Read initial states
    const elements = document.querySelectorAll('[data-flip]')
    for (const el of elements) {
      read(el)
    }

    // Execute the layout change
    await callback()

    // Play animations
    playAll(options)
  }

  const reorder = (
    container: Element | string,
    newOrder: number[],
    options: FlipOptions = {}
  ): void => {
    const containerEl = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!containerEl) return

    const children = Array.from(containerEl.children)

    // Read first state
    readAll(children)

    // Reorder elements
    const fragment = document.createDocumentFragment()
    for (const index of newOrder) {
      if (children[index]) {
        fragment.appendChild(children[index])
      }
    }
    containerEl.appendChild(fragment)

    // Play animation
    playAll(options)
  }

  const autoAnimate = (
    container: Element | string,
    options: FlipOptions = {}
  ): (() => void) => {
    const containerEl = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!containerEl) return () => {}

    let isAnimating = false

    const observer = new MutationObserver((mutations) => {
      if (isAnimating) return

      const addedNodes: Element[] = []
      const removedNodes: Element[] = []

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element) addedNodes.push(node)
        }
        for (const node of mutation.removedNodes) {
          if (node instanceof Element) removedNodes.push(node)
        }
      }

      if (addedNodes.length === 0 && removedNodes.length === 0) return

      isAnimating = true

      // Animate new elements
      for (const node of addedNodes) {
        anime({
          targets: node,
          opacity: [0, 1],
          scale: [0.8, 1],
          duration: options.duration || 300,
          easing: options.easing || 'easeOutQuad',
        })
      }

      // Animate existing elements
      const existing = Array.from(containerEl.children).filter(
        el => !addedNodes.includes(el)
      )
      playAll({ ...options, onComplete: () => { isAnimating = false } })

      setTimeout(() => { isAnimating = false }, (options.duration || 300) + 50)
    })

    observer.observe(containerEl, { childList: true, subtree: false })

    return () => observer.disconnect()
  }

  return {
    read,
    readAll,
    play,
    playAll,
    flip,
    reorder,
    autoAnimate,
  }
}
