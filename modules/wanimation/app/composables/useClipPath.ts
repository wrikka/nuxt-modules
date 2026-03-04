import anime from 'animejs'

export interface ClipPathOptions {
  shape?: 'circle' | 'ellipse' | 'polygon' | 'inset'
  from?: string
  to?: string
  duration?: number
  easing?: string
  trigger?: 'hover' | 'click' | 'scroll' | 'auto'
}

const shapes: Record<string, string> = {
  circle: 'circle(0% at 50% 50%)',
  circleFull: 'circle(150% at 50% 50%)',
  ellipse: 'ellipse(0% 0% at 50% 50%)',
  ellipseFull: 'ellipse(100% 100% at 50% 50%)',
  inset: 'inset(100%)',
  insetFull: 'inset(0%)',
  polygon: 'polygon(50% 50%, 50% 50%, 50% 50%)',
  polygonFull: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
}

export const useClipPath = () => {
  const reveal = (
    element: HTMLElement | string,
    options: ClipPathOptions = {}
  ): { start: () => void; reverse: () => void } => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return { start: () => {}, reverse: () => {} }
    }

    const {
      shape = 'circle',
      from,
      to,
      duration = 800,
      easing = 'easeOutQuad',
    } = options

    const fromPath = from || shapes[shape]
    const toPath = to || shapes[`${shape}Full`]

    el.style.clipPath = fromPath

    const start = () => {
      anime({
        targets: el,
        clipPath: toPath,
        duration,
        easing,
      })
    }

    const reverse = () => {
      anime({
        targets: el,
        clipPath: fromPath,
        duration,
        easing,
      })
    }

    return { start, reverse }
  }

  const morph = (
    element: HTMLElement | string,
    paths: string[],
    options: { duration?: number; loop?: boolean } = {}
  ): anime.AnimeInstance => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return anime({ targets: null, duration: 0 })
    }

    const { duration = 2000, loop = true } = options

    const animObj = { index: 0 }

    return anime({
      targets: animObj,
      index: paths.length - 1,
      duration: duration * paths.length,
      easing: 'linear',
      loop,
      update: () => {
        const idx = Math.floor(animObj.index) % paths.length
        el.style.clipPath = paths[idx]
      },
    })
  }

  return {
    reveal,
    morph,
  }
}
