import anime from 'animejs'

export interface ChromaticAberrationOptions {
  intensity?: number
  speed?: number
  direction?: 'horizontal' | 'vertical' | 'both'
  trigger?: 'hover' | 'scroll' | 'always'
}

export const useChromaticAberration = () => {
  const apply = (
    element: HTMLElement | string,
    options: ChromaticAberrationOptions = {}
  ): { start: () => void; stop: () => void } => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return { start: () => {}, stop: () => {} }
    }

    const {
      intensity = 5,
      speed = 3000,
      direction = 'horizontal',
    } = options

    let anim: anime.AnimeInstance | null = null

    const start = () => {
      const offset = intensity

      el.style.textShadow = `
        ${direction !== 'vertical' ? `-${offset}px` : '0'} ${direction !== 'horizontal' ? `-${offset}px` : '0'} 0 rgba(255, 0, 0, 0.5),
        ${direction !== 'vertical' ? `${offset}px` : '0'} ${direction !== 'horizontal' ? `${offset}px` : '0'} 0 rgba(0, 255, 255, 0.5)
      `

      anim = anime({
        targets: {},
        duration: speed,
        loop: true,
        easing: 'easeInOutSine',
        update: (a) => {
          const progress = a.progress / 100
          const wave = Math.sin(progress * Math.PI * 4) * offset
          el.style.textShadow = `
            ${direction !== 'vertical' ? `${wave}px` : '0'} 0 0 rgba(255, 0, 0, 0.5),
            ${direction !== 'vertical' ? `${-wave}px` : '0'} 0 0 rgba(0, 255, 255, 0.5)
          `
        },
      })
    }

    const stop = () => {
      if (anim) anim.pause()
      el.style.textShadow = ''
    }

    return { start, stop }
  }

  return {
    apply,
  }
}
