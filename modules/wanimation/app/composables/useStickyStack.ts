import anime from 'animejs'

export interface StickyStackOptions {
  cardHeight?: number
  overlap?: number
  duration?: number
  easing?: string
}

export const useStickyStack = () => {
  const create = (
    container: HTMLElement | string,
    options: StickyStackOptions = {}
  ): { destroy: () => void } => {
    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el || !(el instanceof HTMLElement)) {
      return { destroy: () => {} }
    }

    const {
      cardHeight = 400,
      overlap = 100,
      duration = 300,
      easing = 'easeOutQuad',
    } = options

    const cards = Array.from(el.children) as HTMLElement[]

    // Set up sticky positions
    cards.forEach((card, index) => {
      card.style.position = 'sticky'
      card.style.top = `${index * overlap}px`
      card.style.height = `${cardHeight}px`
      card.style.zIndex = String(index + 1)
    })

    // Animate cards as they stack
    const handleScroll = () => {
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight))

        // Scale down cards as they get covered
        const scale = 1 - (progress * 0.05)
        const opacity = 1 - (progress * 0.3)

        anime({
          targets: card,
          scale,
          opacity,
          duration,
          easing,
        })
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return {
      destroy: () => {
        window.removeEventListener('scroll', handleScroll)
      },
    }
  }

  return {
    create,
  }
}
