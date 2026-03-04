import anime from 'animejs'
import { useEventListener, useThrottleFn } from '@vueuse/core'

export interface ScrollLinkedOptions {
  trigger?: 'scroll' | 'container'
  start?: string | number
  end?: string | number
  scrub?: boolean | number
  pin?: boolean
  markers?: boolean
}

export const useScrollLinked = () => {
  const createScrollAnimation = (
    targets: string | Element | Element[] | NodeList | null,
    properties: Record<string, [number | string, number | string]>,
    options: ScrollLinkedOptions = {}
  ): (() => void) => {
    const { start = 'top bottom', end = 'bottom top', scrub = true } = options

    const elements = getElements(targets)
    if (elements.length === 0) return () => {}

    // Parse start/end values
    const parseValue = (val: string | number): number => {
      if (typeof val === 'number') return val
      if (val.includes('%')) {
        return (parseFloat(val) / 100) * window.innerHeight
      }
      return 0
    }

    const startOffset = parseValue(start as string)
    const endOffset = parseValue(end as string)

    let animation: anime.AnimeInstance | null = null

    const handleScroll = useThrottleFn(() => {
      const element = elements[0]
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top + window.scrollY
      const scrollProgress = (window.scrollY - elementTop + startOffset) / (endOffset - startOffset)
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress))

      // Create or update animation
      const animProperties: Record<string, unknown> = {}
      for (const [key, [from, to]] of Object.entries(properties)) {
        if (typeof from === 'number' && typeof to === 'number') {
          animProperties[key] = from + (to - from) * clampedProgress
        } else {
          animProperties[key] = clampedProgress < 0.5 ? from : to
        }
      }

      anime.set(elements, animProperties)
    }, typeof scrub === 'number' ? scrub * 16 : 16)

    const cleanup = useEventListener(window, 'scroll', handleScroll, { passive: true })
    handleScroll()

    return cleanup
  }

  const parallax = (
    targets: string | Element | Element[] | NodeList | null,
    speed: number,
    options: { direction?: 'vertical' | 'horizontal'; clamp?: boolean } = {}
  ): (() => void) => {
    const { direction = 'vertical', clamp = false } = options
    const elements = getElements(targets)

    const handleScroll = useThrottleFn(() => {
      const scrollY = window.scrollY

      for (const el of elements) {
        const rect = el.getBoundingClientRect()
        const elementTop = rect.top + scrollY
        const viewportHeight = window.innerHeight

        // Calculate progress based on element position in viewport
        const distanceFromCenter = scrollY - elementTop + viewportHeight / 2
        const offset = distanceFromCenter * speed

        const value = clamp
          ? Math.max(-viewportHeight, Math.min(viewportHeight, offset))
          : offset

        const prop = direction === 'vertical' ? 'translateY' : 'translateX'
        anime.set(el, { [prop]: value })
      }
    }, 16)

    const cleanup = useEventListener(window, 'scroll', handleScroll, { passive: true })
    handleScroll()

    return cleanup
  }

  const revealOnScroll = (
    targets: string | Element | Element[] | NodeList | null,
    options: {
      threshold?: number
      once?: boolean
      enter?: (el: Element) => void
      leave?: (el: Element) => void
    } = {}
  ): (() => void) => {
    const { threshold = 0.1, once = true, enter, leave } = options
    const elements = getElements(targets)
    const triggered = new Set<Element>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target

          if (entry.isIntersecting) {
            if (!triggered.has(target)) {
              enter?.(target)
              if (once) triggered.add(target)
            }
          } else {
            if (!once || triggered.has(target)) {
              leave?.(target)
            }
          }
        }
      },
      { threshold }
    )

    for (const el of elements) {
      observer.observe(el)
    }

    return () => {
      for (const el of elements) {
        observer.unobserve(el)
      }
      observer.disconnect()
    }
  }

  const scrubAnimation = (
    targets: string | Element | Element[] | NodeList | null,
    animation: (progress: number) => Record<string, unknown>
  ): (() => void) => {
    const elements = getElements(targets)
    if (elements.length === 0) return () => {}

    const firstEl = elements[0]

    const handleScroll = useThrottleFn(() => {
      const rect = firstEl.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate progress (0 to 1) based on element position
      const progress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ))

      const props = animation(progress)
      anime.set(elements, props)
    }, 16)

    const cleanup = useEventListener(window, 'scroll', handleScroll, { passive: true })
    handleScroll()

    return cleanup
  }

  const pinElement = (
    element: HTMLElement | string,
    options: {
      start?: string
      end?: string
      pinSpacing?: boolean
    } = {}
  ): (() => void) => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) return () => {}

    const { start = 'top top', end = '+=500' } = options
    let isPinned = false

    const handleScroll = useThrottleFn(() => {
      const rect = el.getBoundingClientRect()
      const shouldPin = rect.top <= 0

      if (shouldPin && !isPinned) {
        isPinned = true
        el.style.position = 'fixed'
        el.style.top = '0'
        el.style.left = `${rect.left}px`
        el.style.width = `${rect.width}px`
      } else if (!shouldPin && isPinned) {
        isPinned = false
        el.style.position = ''
        el.style.top = ''
        el.style.left = ''
        el.style.width = ''
      }
    }, 16)

    const cleanup = useEventListener(window, 'scroll', handleScroll, { passive: true })

    return cleanup
  }

  return {
    createScrollAnimation,
    parallax,
    revealOnScroll,
    scrubAnimation,
    pinElement,
  }
}

const getElements = (targets: string | Element | Element[] | NodeList | null): Element[] => {
  if (!targets) return []
  if (typeof targets === 'string') {
    return Array.from(document.querySelectorAll(targets))
  }
  if (targets instanceof Element) {
    return [targets]
  }
  if (targets instanceof NodeList) {
    return Array.from(targets)
  }
  return targets
}
