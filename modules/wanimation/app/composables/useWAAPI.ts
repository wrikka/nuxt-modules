export interface WAAPIOptions {
  duration?: number
  delay?: number
  easing?: string
  fill?: 'forwards' | 'backwards' | 'both' | 'none' | 'auto'
  iterations?: number
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
}

export const useWAAPI = () => {
  const animate = (
    element: Element | string,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: WAAPIOptions = {}
  ): Animation | null => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof Element)) return null

    const animation = el.animate(keyframes, {
      duration: options.duration || 300,
      delay: options.delay || 0,
      easing: options.easing || 'ease',
      fill: options.fill || 'forwards',
      iterations: options.iterations ?? 1,
      direction: options.direction || 'normal',
    })

    return animation
  }

  const fadeIn = (
    element: Element | string,
    duration: number = 300
  ): Animation | null => {
    return animate(
      element,
      [{ opacity: 0 }, { opacity: 1 }],
      { duration, easing: 'ease-out', fill: 'forwards' }
    )
  }

  const fadeOut = (
    element: Element | string,
    duration: number = 300
  ): Animation | null => {
    return animate(
      element,
      [{ opacity: 1 }, { opacity: 0 }],
      { duration, easing: 'ease-in', fill: 'forwards' }
    )
  }

  const slideIn = (
    element: Element | string,
    direction: 'left' | 'right' | 'up' | 'down' = 'up',
    distance: number = 50,
    duration: number = 400
  ): Animation | null => {
    const transforms: Record<string, string> = {
      left: `translateX(${distance}px)`,
      right: `translateX(-${distance}px)`,
      up: `translateY(${distance}px)`,
      down: `translateY(-${distance}px)`,
    }

    return animate(
      element,
      [
        { transform: transforms[direction], opacity: 0 },
        { transform: 'translateX(0) translateY(0)', opacity: 1 },
      ],
      { duration, easing: 'ease-out', fill: 'forwards' }
    )
  }

  const scale = (
    element: Element | string,
    from: number = 0,
    to: number = 1,
    duration: number = 300
  ): Animation | null => {
    return animate(
      element,
      [{ transform: `scale(${from})` }, { transform: `scale(${to})` }],
      { duration, easing: 'ease-out', fill: 'forwards' }
    )
  }

  const spring = (
    element: Element | string,
    property: string,
    from: number,
    to: number,
    stiffness: number = 100,
    damping: number = 10
  ): Animation | null => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof Element)) return null

    // Create a spring-like animation using keyframes
    const keyframes: Keyframe[] = []
    const steps = 60
    let velocity = 0
    let position = from

    for (let i = 0; i <= steps; i++) {
      const force = (to - position) * stiffness * 0.001
      velocity += force
      velocity *= (1 - damping * 0.01)
      position += velocity

      keyframes.push({ [property]: position })
    }

    return el.animate(keyframes, {
      duration: 1000,
      easing: 'linear',
      fill: 'forwards',
    })
  }

  const stagger = (
    elements: Element[] | string,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: WAAPIOptions & { staggerDelay?: number } = {}
  ): Animation[] => {
    const { staggerDelay = 50, ...animOptions } = options

    const els = typeof elements === 'string'
      ? Array.from(document.querySelectorAll(elements))
      : elements

    return els.map((el, index) => {
      return el.animate(keyframes, {
        ...animOptions,
        delay: (animOptions.delay || 0) + index * staggerDelay,
      })
    })
  }

  const stopAll = (element: Element | string): void => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof Element)) return

    el.getAnimations().forEach(anim => anim.cancel())
  }

  const finishAll = (element: Element | string): void => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof Element)) return

    el.getAnimations().forEach(anim => anim.finish())
  }

  const pauseAll = (element: Element | string): void => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof Element)) return

    el.getAnimations().forEach(anim => anim.pause())
  }

  const playAll = (element: Element | string): void => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof Element)) return

    el.getAnimations().forEach(anim => anim.play())
  }

  return {
    animate,
    fadeIn,
    fadeOut,
    slideIn,
    scale,
    spring,
    stagger,
    stopAll,
    finishAll,
    pauseAll,
    playAll,
  }
}
