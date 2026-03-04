export interface SvgFilterOptions {
  blur?: number
  brightness?: number
  contrast?: number
  saturate?: number
  hueRotate?: number
  sepia?: number
  grayscale?: number
  invert?: number
  opacity?: number
  dropShadow?: { x: number; y: number; blur: number; color: string }
  turbulence?: { baseFrequency: number; numOctaves: number; seed: number }
  displacement?: { scale: number; in: string }
}

export const useSvgFilters = () => {
  let filterId = 0

  const apply = (
    element: Element | string,
    options: SvgFilterOptions
  ): (() => void) => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) return () => {}

    filterId++
    const id = `wanimation-filter-${filterId}`

    // Create SVG filter
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('style', 'position: absolute; width: 0; height: 0;')
    svg.setAttribute('aria-hidden', 'true')

    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
    filter.setAttribute('id', id)

    let lastResult = 'SourceGraphic'

    // Blur
    if (options.blur) {
      const feBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur')
      feBlur.setAttribute('in', lastResult)
      feBlur.setAttribute('stdDeviation', String(options.blur))
      feBlur.setAttribute('result', 'blur')
      filter.appendChild(feBlur)
      lastResult = 'blur'
    }

    // Color adjustments
    if (options.brightness !== undefined || options.contrast !== undefined || options.saturate !== undefined) {
      const feColorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feComponentTransfer')
      // Simplified - in production use feColorMatrix for full control
      lastResult = 'colorAdjust'
    }

    // Drop shadow
    if (options.dropShadow) {
      const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow')
      feDropShadow.setAttribute('dx', String(options.dropShadow.x))
      feDropShadow.setAttribute('dy', String(options.dropShadow.y))
      feDropShadow.setAttribute('stdDeviation', String(options.dropShadow.blur))
      feDropShadow.setAttribute('flood-color', options.dropShadow.color)
      feDropShadow.setAttribute('in', lastResult)
      feDropShadow.setAttribute('result', 'dropShadow')
      filter.appendChild(feDropShadow)
      lastResult = 'dropShadow'
    }

    // Turbulence
    if (options.turbulence) {
      const feTurbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence')
      feTurbulence.setAttribute('baseFrequency', String(options.turbulence.baseFrequency))
      feTurbulence.setAttribute('numOctaves', String(options.turbulence.numOctaves))
      feTurbulence.setAttribute('seed', String(options.turbulence.seed))
      feTurbulence.setAttribute('result', 'turbulence')
      filter.appendChild(feTurbulence)

      if (options.displacement) {
        const feDisplacement = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap')
        feDisplacement.setAttribute('in', lastResult)
        feDisplacement.setAttribute('in2', 'turbulence')
        feDisplacement.setAttribute('scale', String(options.displacement.scale))
        feDisplacement.setAttribute('xChannelSelector', 'R')
        feDisplacement.setAttribute('yChannelSelector', 'G')
        feDisplacement.setAttribute('result', 'displacement')
        filter.appendChild(feDisplacement)
        lastResult = 'displacement'
      }
    }

    // Merge final result
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge')
    const feMergeNode = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode')
    feMergeNode.setAttribute('in', lastResult)
    feMerge.appendChild(feMergeNode)
    filter.appendChild(feMerge)

    svg.appendChild(filter)
    document.body.appendChild(svg)

    // Apply filter to element
    el.style.filter = `url(#${id})`

    return () => {
      el.style.filter = ''
      svg.remove()
    }
  }

  const animateFilter = (
    element: Element | string,
    property: 'blur' | 'brightness' | 'contrast',
    from: number,
    to: number,
    duration: number = 1000
  ): Promise<void> => {
    return new Promise((resolve) => {
      const el = typeof element === 'string'
        ? document.querySelector(element)
        : element

      if (!el || !(el instanceof HTMLElement)) {
        resolve()
        return
      }

      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const value = from + (to - from) * progress

        if (property === 'blur') {
          el.style.filter = `blur(${value}px)`
        } else if (property === 'brightness') {
          el.style.filter = `brightness(${value})`
        } else if (property === 'contrast') {
          el.style.filter = `contrast(${value}%)`
        }

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }

      requestAnimationFrame(animate)
    })
  }

  return {
    apply,
    animateFilter,
  }
}
