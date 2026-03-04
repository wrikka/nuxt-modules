import anime from 'animejs'

export interface IntersectionTimelineOptions {
  duration?: number
  easing?: string
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export const useIntersectionTimeline = () => {
  const create = (
    element: Element | string,
    animations: Array<{
      progress: number
      properties: Record<string, number | string>
    }>,
    options: IntersectionTimelineOptions = {}
  ): (() => void) => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof Element)) return () => {}

    const { threshold = 0.5, rootMargin = '0px', once = false } = options

    let animationInstance: anime.AnimeInstance | null = null
    let hasTriggered = false

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        if (entry.isIntersecting && (!once || !hasTriggered)) {
          hasTriggered = true

          // Create timeline from keyframes
          const keyframes = animations.map(anim => ({
            ...anim.properties,
            duration: anim.progress * 1000,
          }))

          animationInstance = anime({
            targets: el,
            keyframes,
            easing: options.easing || 'easeOutQuad',
          })
        } else if (!entry.isIntersecting && !once && animationInstance) {
          animationInstance.reverse()
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (animationInstance) {
        animationInstance.pause()
        anime.remove(el)
      }
    }
  }

  const scrollProgress = (
    element: Element | string,
    properties: Record<string, [number | string, number | string]>,
    options: { root?: Element | null } = {}
  ): (() => void) => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof Element)) return () => {}

    let rafId: number | null = null

    const handleScroll = () => {
      const rect = el.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate progress (0 to 1) based on element position
      const progress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ))

      // Apply properties based on progress
      const styles: Record<string, string> = {}
      for (const [prop, [from, to]] of Object.entries(properties)) {
        if (typeof from === 'number' && typeof to === 'number') {
          const value = from + (to - from) * progress
          styles[prop] = String(value)
        } else {
          styles[prop] = progress > 0.5 ? String(to) : String(from)
        }
      }

      anime.set(el, styles)
      rafId = requestAnimationFrame(handleScroll)
    }

    rafId = requestAnimationFrame(handleScroll)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }

  return {
    create,
    scrollProgress,
  }
}
