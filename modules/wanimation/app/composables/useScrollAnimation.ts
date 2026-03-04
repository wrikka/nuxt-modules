import anime from 'animejs'
import { useEventListener, useThrottleFn } from '@vueuse/core'

export const useScrollAnimation = () => {
  const observe = (
    targets: string,
    options: {
      threshold?: number
      rootMargin?: string
      once?: boolean
    } = {},
    animation: (el: Element) => anime.AnimeInstance | void
  ): (() => void) => {
    const { threshold = 0.1, rootMargin = '0px', once = true } = options

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animation(entry.target)
            if (once) {
              observer.unobserve(entry.target)
            }
          }
        }
      },
      { threshold, rootMargin }
    )

    const elements = document.querySelectorAll(targets)
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

  const parallax = (
    targets: string | Element | Element[] | NodeList | null,
    speed: number,
    options: { throttle?: number; direction?: 'vertical' | 'horizontal' } = {}
  ): (() => void) => {
    const { throttle = 16, direction = 'vertical' } = options

    const handleScroll = useThrottleFn(() => {
      const scrollY = window.scrollY || window.pageYOffset
      const elements = getElements(targets)

      for (const el of elements) {
        const rect = el.getBoundingClientRect()
        const elementTop = rect.top + scrollY
        const relativeScroll = scrollY - elementTop + window.innerHeight

        const offset = relativeScroll * speed
        const prop = direction === 'vertical' ? 'translateY' : 'translateX'

        anime.set(el, {
          [prop]: offset,
        })
      }
    }, throttle)

    const cleanup = useEventListener(window, 'scroll', handleScroll, { passive: true })
    handleScroll()

    return cleanup
  }

  const reveal = (
    targets: string,
    options: {
      duration?: number
      distance?: number
      origin?: 'top' | 'bottom' | 'left' | 'right'
      delay?: number
      easing?: string
    } = {}
  ): (() => void) => {
    const {
      duration = 600,
      distance = 50,
      origin = 'bottom',
      delay = 0,
      easing = 'easeOutCubic',
    } = options

    const elements = document.querySelectorAll(targets)
    for (const el of elements) {
      el.style.opacity = '0'
    }

    return observe(
      targets,
      { threshold: 0.1, once: true },
      (el) => {
        const translateMap = {
          top: { translateY: -distance },
          bottom: { translateY: distance },
          left: { translateX: -distance },
          right: { translateX: distance },
        }

        anime({
          targets: el,
          opacity: [0, 1],
          ...translateMap[origin],
          duration,
          delay,
          easing,
        })
      }
    )
  }

  return {
    observe,
    parallax,
    reveal,
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
