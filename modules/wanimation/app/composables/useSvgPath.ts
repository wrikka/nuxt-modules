import anime from 'animejs'

export interface SvgPathOptions {
  duration?: number
  easing?: string
  delay?: number
  loop?: boolean | number
  direction?: 'normal' | 'reverse' | 'alternate'
  autoplay?: boolean
  strokeColor?: string
  strokeWidth?: number
  fillColor?: string
}

export const useSvgPath = () => {
  const draw = (
    element: SVGPathElement | string,
    options: SvgPathOptions = {}
  ): anime.AnimeInstance => {
    const {
      duration = 2000,
      easing = 'easeInOutSine',
      delay = 0,
      loop = false,
      direction = 'normal',
      autoplay = true,
    } = options

    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof SVGPathElement)) {
      return anime({ targets: null, duration: 0 })
    }

    const length = el.getTotalLength()

    // Set up initial state
    el.style.strokeDasharray = `${length}`
    el.style.strokeDashoffset = `${length}`
    el.style.fill = 'transparent'

    return anime({
      targets: el,
      strokeDashoffset: [length, 0],
      duration,
      easing,
      delay,
      loop,
      direction,
      autoplay,
      complete: () => {
        // Optional: fill the path after drawing
        if (options.fillColor) {
          anime({
            targets: el,
            fill: options.fillColor,
            duration: 500,
            easing: 'easeOutQuad',
          })
        }
      },
    })
  }

  const drawMultiple = (
    elements: (SVGPathElement | string)[],
    options: SvgPathOptions & { stagger?: number } = {}
  ): anime.AnimeInstance[] => {
    const { stagger = 100, ...drawOptions } = options

    return elements.map((el, index) => {
      return draw(el, {
        ...drawOptions,
        delay: (drawOptions.delay || 0) + index * stagger,
      })
    })
  }

  const erase = (
    element: SVGPathElement | string,
    options: Omit<SvgPathOptions, 'direction'> = {}
  ): anime.AnimeInstance => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof SVGPathElement)) {
      return anime({ targets: null, duration: 0 })
    }

    const length = el.getTotalLength()

    return anime({
      targets: el,
      strokeDashoffset: [0, length],
      duration: options.duration || 1000,
      easing: options.easing || 'easeInOutSine',
      delay: options.delay || 0,
    })
  }

  const reveal = (
    element: SVGPathElement | string,
    options: SvgPathOptions = {}
  ): anime.AnimeInstance => {
    const {
      duration = 1500,
      easing = 'easeOutQuad',
      delay = 0,
    } = options

    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof SVGPathElement)) {
      return anime({ targets: null, duration: 0 })
    }

    const length = el.getTotalLength()

    el.style.strokeDasharray = `${length}`
    el.style.strokeDashoffset = `${length}`

    return anime({
      targets: el,
      strokeDashoffset: [length, 0],
      opacity: [0, 1],
      duration,
      easing,
      delay,
    })
  }

  const trace = (
    pathElement: SVGPathElement | string,
    targetElement: Element | string,
    options: {
      duration?: number
      easing?: string
      loop?: boolean
    } = {}
  ): (() => void) => {
    const { duration = 2000, easing = 'linear', loop = false } = options

    const path = typeof pathElement === 'string'
      ? document.querySelector(pathElement)
      : pathElement

    const target = typeof targetElement === 'string'
      ? document.querySelector(targetElement)
      : targetElement

    if (!path || !(path instanceof SVGPathElement) || !target) {
      return () => {}
    }

    let progress = { value: 0 }
    let animation: anime.AnimeInstance | null = null

    const animate = () => {
      animation = anime({
        targets: progress,
        value: 1,
        duration,
        easing,
        loop,
        update: () => {
          const point = path.getPointAtLength(progress.value * path.getTotalLength())
          anime.set(target, {
            translateX: point.x,
            translateY: point.y,
          })
        },
      })
    }

    animate()

    return () => {
      animation?.pause()
    }
  }

  const morphStroke = (
    element: SVGPathElement | string,
    toPath: string,
    options: SvgPathOptions = {}
  ): Promise<void> => {
    return new Promise((resolve) => {
      const el = typeof element === 'string'
        ? document.querySelector(element)
        : element

      if (!el || !(el instanceof SVGPathElement)) {
        resolve()
        return
      }

      const fromPath = el.getAttribute('d') || ''
      const length = el.getTotalLength()
      const animObj = { progress: 0 }

      // Set up stroke animation
      el.style.strokeDasharray = `${length}`

      anime({
        targets: animObj,
        progress: 1,
        duration: options.duration || 1000,
        easing: options.easing || 'easeInOutQuad',
        update: () => {
          // Interpolate path
          const fromNumbers = (fromPath.match(/-?\d+\.?\d*/g) || []).map(Number)
          const toNumbers = (toPath.match(/-?\d+\.?\d*/g) || []).map(Number)

          if (fromNumbers.length === toNumbers.length) {
            let numIndex = 0
            const interpolated = from.replace(/-?\d+\.?\d*/g, () => {
              const fromVal = fromNumbers[numIndex]
              const toVal = toNumbers[numIndex++] ?? fromVal
              const val = fromVal + (toVal - fromVal) * animObj.progress
              return Number.isInteger(val) ? String(val) : val.toFixed(2)
            })
            el.setAttribute('d', interpolated)
          }
        },
        complete: () => resolve(),
      })
    })
  }

  return {
    draw,
    drawMultiple,
    erase,
    reveal,
    trace,
    morphStroke,
  }
}
