import anime from 'animejs'

export interface VariableFontOptions {
  weight?: [number, number]
  width?: [number, number]
  slant?: [number, number]
  size?: [number, number]
  duration?: number
  easing?: string
  stagger?: number
}

export const useVariableFont = () => {
  const animate = (
    element: HTMLElement | string,
    options: VariableFontOptions
  ): anime.AnimeInstance => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return anime({ targets: null, duration: 0 })
    }

    const {
      weight = [400, 700],
      width = [100, 100],
      slant = [0, 0],
      duration = 2000,
      easing = 'easeInOutQuad',
    } = options

    // Set variable font settings
    el.style.fontVariationSettings = `'wght' ${weight[0]}, 'wdth' ${width[0]}, 'slnt' ${slant[0]}`

    const animObj = {
      weight: weight[0],
      width: width[0],
      slant: slant[0],
    }

    return anime({
      targets: animObj,
      weight: weight[1],
      width: width[1],
      slant: slant[1],
      duration,
      easing,
      update: () => {
        el.style.fontVariationSettings = `'wght' ${animObj.weight}, 'wdth' ${animObj.width}, 'slnt' ${animObj.slant}`
      },
    })
  }

  const wobble = (
    element: HTMLElement | string,
    intensity: number = 100,
    speed: number = 2000
  ): anime.AnimeInstance => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return anime({ targets: null, duration: 0 })
    }

    const baseWeight = 400

    return anime({
      targets: {},
      duration: speed,
      easing: 'easeInOutSine',
      loop: true,
      direction: 'alternate',
      update: (anim) => {
        const progress = anim.progress / 100
        const weight = baseWeight + Math.sin(progress * Math.PI * 2) * intensity
        el.style.fontVariationSettings = `'wght' ${weight}`
      },
    })
  }

  return {
    animate,
    wobble,
  }
}
