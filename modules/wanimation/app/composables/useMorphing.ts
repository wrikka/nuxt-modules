import anime from 'animejs'

export interface MorphOptions {
  duration?: number
  easing?: string
  delay?: number
  loop?: boolean | number
  direction?: 'normal' | 'reverse' | 'alternate'
  autoplay?: boolean
}

const parsePath = (path: string): number[] => {
  // Simple path parsing - extract numbers from path string
  const matches = path.match(/-?\d+\.?\d*/g)
  return matches ? matches.map(Number) : []
}

const interpolatePath = (from: string, to: string, progress: number): string => {
  const fromNumbers = parsePath(from)
  const toNumbers = parsePath(to)

  if (fromNumbers.length !== toNumbers.length) {
    console.warn('Path mismatch: morphing requires same number of path commands')
    return to
  }

  const interpolated = fromNumbers.map((fromVal, i) => {
    const toVal = toNumbers[i] ?? fromVal
    return fromVal + (toVal - fromVal) * progress
  })

  // Rebuild path with interpolated values
  let numIndex = 0
  return from.replace(/-?\d+\.?\d*/g, () => {
    const val = interpolated[numIndex++] ?? 0
    return Number.isInteger(val) ? String(val) : val.toFixed(2)
  })
}

export const useMorphing = () => {
  const morph = (
    element: SVGPathElement | string,
    toPath: string,
    options: MorphOptions = {}
  ): Promise<void> => {
    const {
      duration = 800,
      easing = 'easeInOutQuad',
      delay = 0,
      loop = false,
      direction = 'normal',
    } = options

    return new Promise((resolve) => {
      const el = typeof element === 'string'
        ? document.querySelector(element)
        : element

      if (!el || !(el instanceof SVGPathElement)) {
        resolve()
        return
      }

      const fromPath = el.getAttribute('d') || ''
      const animObj = { progress: 0 }

      anime({
        targets: animObj,
        progress: 1,
        duration,
        delay,
        easing,
        loop,
        direction,
        update: () => {
          const currentPath = interpolatePath(fromPath, toPath, animObj.progress)
          el.setAttribute('d', currentPath)
        },
        complete: () => resolve(),
      })
    })
  }

  const morphShapes = (
    shapes: Array<{ element: SVGPathElement | string; toPath: string }>,
    options: MorphOptions = {}
  ): Promise<void> => {
    const promises = shapes.map(shape => morph(shape.element, shape.toPath, options))
    return Promise.all(promises).then(() => undefined)
  }

  const createMorphablePath = (element: SVGPathElement | string): {
    to: (path: string, options?: MorphOptions) => Promise<void>
    sequence: (paths: string[], options?: MorphOptions & { pauseBetween?: number }) => Promise<void>
  } => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof SVGPathElement)) {
      return {
        to: () => Promise.resolve(),
        sequence: () => Promise.resolve(),
      }
    }

    return {
      to: (path: string, options?: MorphOptions) => morph(el, path, options),
      sequence: async (paths: string[], options?: MorphOptions & { pauseBetween?: number }) => {
        const { pauseBetween = 0, ...morphOptions } = options ?? {}
        for (const path of paths) {
          await morph(el, path, morphOptions)
          if (pauseBetween > 0) {
            await new Promise(r => setTimeout(r, pauseBetween))
          }
        }
      },
    }
  }

  return {
    morph,
    morphShapes,
    createMorphablePath,
  }
}
