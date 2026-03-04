import anime from 'animejs'

export const useFade = () => {
  const fadeIn = (targets: string | Element | Element[] | NodeList | null, duration = 300): Promise<void> => {
    return new Promise((resolve) => {
      anime({
        targets,
        opacity: [0, 1],
        duration,
        easing: 'easeOutQuad',
        complete: () => resolve(),
      })
    })
  }

  const fadeOut = (targets: string | Element | Element[] | NodeList | null, duration = 300): Promise<void> => {
    return new Promise((resolve) => {
      anime({
        targets,
        opacity: [1, 0],
        duration,
        easing: 'easeInQuad',
        complete: () => resolve(),
      })
    })
  }

  const fadeToggle = async (
    targets: string | Element | Element[] | NodeList | null,
    duration = 300
  ): Promise<void> => {
    const elements = getElements(targets)
    const first = elements[0]
    if (!first) return

    const currentOpacity = parseFloat(window.getComputedStyle(first).opacity)
    if (currentOpacity > 0.5) {
      await fadeOut(targets, duration)
    } else {
      await fadeIn(targets, duration)
    }
  }

  const fadeTo = (
    targets: string | Element | Element[] | NodeList | null,
    opacity: number,
    duration = 300
  ): Promise<void> => {
    return new Promise((resolve) => {
      anime({
        targets,
        opacity,
        duration,
        easing: 'easeInOutQuad',
        complete: () => resolve(),
      })
    })
  }

  return {
    fadeIn,
    fadeOut,
    fadeToggle,
    fadeTo,
  }
}

const getElements = (targets: string | Element | Element[] | NodeList | null): Element[] => {
  if (!targets) return []
  if (typeof targets === 'string') {
    return Array.from(document.querySelectorAll(targets))
  }
  if (targets instanceof Element) {
    return [targets]
  }
  if (targets instanceof NodeList) {
    return Array.from(targets)
  }
  return targets
}
