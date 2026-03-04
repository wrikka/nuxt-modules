import anime from 'animejs'

export interface MicroInteractionOptions {
  duration?: number
  easing?: string
  scale?: number
  intensity?: number
}

export const useMicroInteractions = () => {
  const ripple = (
    element: HTMLElement | string,
    event?: MouseEvent,
    options: { color?: string; duration?: number; opacity?: number } = {}
  ): void => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) return

    const { color = 'rgba(255, 255, 255, 0.4)', duration = 600, opacity = 0.6 } = options

    // Create ripple element
    const ripple = document.createElement('span')
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: ${color};
      pointer-events: none;
      transform: scale(0);
      opacity: ${opacity};
    `

    // Position
    const rect = el.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event ? event.clientX - rect.left - size / 2 : rect.width / 2 - size / 2
    const y = event ? event.clientY - rect.top - size / 2 : rect.height / 2 - size / 2

    ripple.style.width = `${size}px`
    ripple.style.height = `${size}px`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`

    // Ensure element is positioned
    const computedStyle = window.getComputedStyle(el)
    if (computedStyle.position === 'static') {
      el.style.position = 'relative'
    }
    el.style.overflow = 'hidden'

    el.appendChild(ripple)

    anime({
      targets: ripple,
      scale: [0, 2],
      opacity: [opacity, 0],
      duration,
      easing: 'easeOutQuad',
      complete: () => ripple.remove(),
    })
  }

  const press = (
    element: HTMLElement | string,
    options: MicroInteractionOptions = {}
  ): anime.AnimeInstance => {
    const { scale = 0.95, duration = 100, easing = 'easeOutQuad' } = options

    return anime({
      targets: element,
      scale,
      duration,
      easing,
      direction: 'alternate',
    })
  }

  const hover = (
    element: HTMLElement | string,
    options: MicroInteractionOptions = {}
  ): { enter: () => void; leave: () => void } => {
    const { scale = 1.05, duration = 200, easing = 'easeOutQuad' } = options
    let animation: anime.AnimeInstance | null = null

    const enter = () => {
      animation?.pause()
      animation = anime({
        targets: element,
        scale,
        duration,
        easing,
      })
    }

    const leave = () => {
      animation?.pause()
      animation = anime({
        targets: element,
        scale: 1,
        duration,
        easing,
      })
    }

    return { enter, leave }
  }

  const focus = (
    element: HTMLElement | string,
    options: { color?: string; duration?: number } = {}
  ): anime.AnimeInstance => {
    const { color = 'rgba(59, 130, 246, 0.5)', duration = 300 } = options

    return anime({
      targets: element,
      boxShadow: [
        { value: '0 0 0 0 transparent', duration: 0 },
        { value: `0 0 0 3px ${color}`, duration: duration / 2 },
        { value: `0 0 0 2px ${color}`, duration: duration / 2 },
      ],
      easing: 'easeOutQuad',
    })
  }

  const shake = (
    element: HTMLElement | string,
    options: { intensity?: number; duration?: number } = {}
  ): anime.AnimeInstance => {
    const { intensity = 10, duration = 400 } = options

    return anime({
      targets: element,
      translateX: [
        { value: -intensity, duration: duration / 4 },
        { value: intensity, duration: duration / 4 },
        { value: -intensity / 2, duration: duration / 4 },
        { value: intensity / 2, duration: duration / 4 },
        { value: 0, duration: duration / 4 },
      ],
      easing: 'easeInOutSine',
    })
  }

  const pulse = (
    element: HTMLElement | string,
    options: { scale?: number; duration?: number; loop?: boolean | number } = {}
  ): anime.AnimeInstance => {
    const { scale = 1.1, duration = 1000, loop = true } = options

    return anime({
      targets: element,
      scale: [1, scale, 1],
      duration,
      easing: 'easeInOutSine',
      loop,
    })
  }

  const spin = (
    element: HTMLElement | string,
    options: { duration?: number; direction?: 'cw' | 'ccw' } = {}
  ): anime.AnimeInstance => {
    const { duration = 1000, direction = 'cw' } = options
    const rotation = direction === 'cw' ? '1turn' : '-1turn'

    return anime({
      targets: element,
      rotate: rotation,
      duration,
      easing: 'linear',
    })
  }

  const bounce = (
    element: HTMLElement | string,
    options: { height?: number; duration?: number } = {}
  ): anime.AnimeInstance => {
    const { height = 10, duration = 600 } = options

    return anime({
      targets: element,
      translateY: [
        { value: -height, duration: duration / 2 },
        { value: 0, duration: duration / 2 },
      ],
      easing: 'easeOutBounce',
    })
  }

  const heartbeat = (
    element: HTMLElement | string,
    options: { scale?: number; duration?: number } = {}
  ): anime.AnimeInstance => {
    const { scale = 1.3, duration = 1000 } = options

    return anime({
      targets: element,
      scale: [
        { value: 1, duration: 0 },
        { value: scale, duration: duration * 0.15 },
        { value: 1, duration: duration * 0.15 },
        { value: scale, duration: duration * 0.15 },
        { value: 1, duration: duration * 0.55 },
      ],
      easing: 'easeInOutQuad',
      loop: true,
    })
  }

  const attach = (
    element: HTMLElement | string,
    interactions: Array<'ripple' | 'press' | 'hover' | 'focus' | 'pulse'>,
    options: Record<string, MicroInteractionOptions> = {}
  ): (() => void) => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) return () => {}

    const cleanups: Array<() => void> = []

    // Ripple effect
    if (interactions.includes('ripple')) {
      const handleClick = (e: MouseEvent) => {
        ripple(el, e, options.ripple)
      }
      el.addEventListener('click', handleClick)
      cleanups.push(() => el.removeEventListener('click', handleClick))
    }

    // Press effect
    if (interactions.includes('press')) {
      const handleMousedown = () => {
        anime({
          targets: el,
          scale: options.press?.scale || 0.95,
          duration: options.press?.duration || 100,
          easing: options.press?.easing || 'easeOutQuad',
        })
      }
      const handleMouseup = () => {
        anime({
          targets: el,
          scale: 1,
          duration: options.press?.duration || 100,
          easing: options.press?.easing || 'easeOutQuad',
        })
      }
      el.addEventListener('mousedown', handleMousedown)
      el.addEventListener('mouseup', handleMouseup)
      el.addEventListener('mouseleave', handleMouseup)
      cleanups.push(() => {
        el.removeEventListener('mousedown', handleMousedown)
        el.removeEventListener('mouseup', handleMouseup)
        el.removeEventListener('mouseleave', handleMouseup)
      })
    }

    // Hover effect
    if (interactions.includes('hover')) {
      const hoverHandlers = hover(el, options.hover)
      el.addEventListener('mouseenter', hoverHandlers.enter)
      el.addEventListener('mouseleave', hoverHandlers.leave)
      cleanups.push(() => {
        el.removeEventListener('mouseenter', hoverHandlers.enter)
        el.removeEventListener('mouseleave', hoverHandlers.leave)
      })
    }

    // Focus effect
    if (interactions.includes('focus')) {
      const handleFocus = () => focus(el, options.focus)
      const handleBlur = () => {
        anime({
          targets: el,
          boxShadow: '0 0 0 0 transparent',
          duration: options.focus?.duration || 200,
          easing: 'easeOutQuad',
        })
      }
      el.addEventListener('focus', handleFocus)
      el.addEventListener('blur', handleBlur)
      cleanups.push(() => {
        el.removeEventListener('focus', handleFocus)
        el.removeEventListener('blur', handleBlur)
      })
    }

    // Pulse effect
    if (interactions.includes('pulse')) {
      pulse(el, options.pulse)
    }

    return () => cleanups.forEach(cleanup => cleanup())
  }

  return {
    ripple,
    press,
    hover,
    focus,
    shake,
    pulse,
    spin,
    bounce,
    heartbeat,
    attach,
  }
}
