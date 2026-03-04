import anime from 'animejs'

export interface FloatingIslandOptions {
  amplitude?: number
  speed?: number
  direction?: 'both' | 'vertical' | 'horizontal'
  rotate?: boolean
}

export const useFloatingIsland = () => {
  const apply = (
    element: HTMLElement | string,
    options: FloatingIslandOptions = {}
  ): { destroy: () => void } => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return { destroy: () => {} }
    }

    const {
      amplitude = 15,
      speed = 3000,
      direction = 'both',
      rotate = true,
    } = options

    const animations: anime.AnimeInstance[] = []

    // Vertical float
    if (direction === 'both' || direction === 'vertical') {
      animations.push(
        anime({
          targets: el,
          translateY: [-amplitude, amplitude],
          duration: speed,
          easing: 'easeInOutSine',
          loop: true,
          direction: 'alternate',
        })
      )
    }

    // Horizontal float
    if (direction === 'both' || direction === 'horizontal') {
      animations.push(
        anime({
          targets: el,
          translateX: [-amplitude * 0.5, amplitude * 0.5],
          duration: speed * 1.3,
          easing: 'easeInOutSine',
          loop: true,
          direction: 'alternate',
        })
      )
    }

    // Slight rotation
    if (rotate) {
      animations.push(
        anime({
          targets: el,
          rotate: [-2, 2],
          duration: speed * 0.8,
          easing: 'easeInOutSine',
          loop: true,
          direction: 'alternate',
        })
      )
    }

    return {
      destroy: () => {
        animations.forEach(anim => anim.pause())
        anime.remove(el)
      },
    }
  }

  return {
    apply,
  }
}
