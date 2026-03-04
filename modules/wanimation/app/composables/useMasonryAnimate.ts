import anime from 'animejs'

export interface MasonryAnimateOptions {
  duration?: number
  easing?: string
  stagger?: number
  resizeDebounce?: number
}

export const useMasonryAnimate = () => {
  const layout = (
    container: HTMLElement | string,
    options: MasonryAnimateOptions = {}
  ): { destroy: () => void; refresh: () => void } => {
    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el || !(el instanceof HTMLElement)) {
      return { destroy: () => {}, refresh: () => {} }
    }

    const {
      duration = 400,
      easing = 'easeOutQuad',
      stagger = 50,
      resizeDebounce = 250,
    } = options

    const children = Array.from(el.children) as HTMLElement[]
    const columnWidth = children[0]?.offsetWidth || 300
    const gap = parseInt(getComputedStyle(el).gap || '16')
    const columns = Math.floor(el.offsetWidth / (columnWidth + gap)) || 1

    const columnHeights = new Array(columns).fill(0)

    const positions = children.map((child, index) => {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights))
      const x = shortestColumn * (columnWidth + gap)
      const y = columnHeights[shortestColumn]

      columnHeights[shortestColumn] += child.offsetHeight + gap

      return { child, x, y, index }
    })

    // Animate to positions
    positions.forEach(({ child, x, y, index }) => {
      anime({
        targets: child,
        translateX: x,
        translateY: y,
        opacity: [0, 1],
        duration,
        easing,
        delay: index * stagger,
      })
    })

    // Set container height
    el.style.height = `${Math.max(...columnHeights)}px`

    // Handle resize
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        refresh()
      }, resizeDebounce)
    }

    window.addEventListener('resize', handleResize)

    const refresh = () => {
      layout(el, options)
    }

    const destroy = () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout) clearTimeout(resizeTimeout)
    }

    return { destroy, refresh }
  }

  return {
    layout,
  }
}
