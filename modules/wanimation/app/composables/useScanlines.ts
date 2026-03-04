import anime from 'animejs'

export interface ScanlinesOptions {
  opacity?: number
  lineHeight?: number
  speed?: number
  flicker?: boolean
  color?: string
}

export const useScanlines = () => {
  const apply = (
    container: HTMLElement | string,
    options: ScanlinesOptions = {}
  ): { destroy: () => void } => {
    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el || !(el instanceof HTMLElement)) {
      return { destroy: () => {} }
    }

    const {
      opacity = 0.3,
      lineHeight = 2,
      speed = 100,
      flicker = true,
      color = '#000000',
    } = options

    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent ${lineHeight}px,
        ${color} ${lineHeight}px,
        ${color} ${lineHeight * 2}px
      );
      opacity: ${opacity};
    `

    el.style.position = 'relative'
    el.appendChild(overlay)

    let anim: anime.AnimeInstance | null = null

    if (flicker) {
      anim = anime({
        targets: overlay,
        opacity: [opacity * 0.7, opacity],
        duration: speed * 10,
        easing: 'steps(5)',
        loop: true,
      })
    }

    return {
      destroy: () => {
        if (anim) anim.pause()
        overlay.remove()
      },
    }
  }

  return {
    apply,
  }
}
