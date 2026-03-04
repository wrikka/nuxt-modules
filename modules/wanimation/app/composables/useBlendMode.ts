import anime from 'animejs'

export interface BlendModeOptions {
  mode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity'
  animate?: boolean
  duration?: number
}

export const useBlendMode = () => {
  const apply = (
    element: HTMLElement | string,
    options: BlendModeOptions = {}
  ): (() => void) => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) return () => {}

    const { mode = 'normal' } = options

    el.style.mixBlendMode = mode

    return () => {
      el.style.mixBlendMode = ''
    }
  }

  const animate = (
    element: HTMLElement | string,
    modes: string[],
    duration: number = 3000
  ): anime.AnimeInstance => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return anime({ targets: null, duration: 0 })
    }

    const animObj = { index: 0 }

    return anime({
      targets: animObj,
      index: modes.length - 1,
      duration,
      easing: 'linear',
      update: () => {
        const modeIndex = Math.floor(animObj.index)
        el.style.mixBlendMode = modes[modeIndex] || modes[0]
      },
    })
  }

  return {
    apply,
    animate,
  }
}
