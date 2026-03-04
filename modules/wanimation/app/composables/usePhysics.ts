import anime from 'animejs'

export interface SpringOptions {
  stiffness?: number
  damping?: number
  mass?: number
  initialVelocity?: number
}

export interface PhysicsOptions {
  duration?: number
  autoplay?: boolean
}

const createSpringEasing = (options: SpringOptions): string => {
  const { stiffness = 100, damping = 10, mass = 1 } = options
  // Anime.js spring format: spring(mass, stiffness, damping, velocity)
  return `spring(${mass}, ${stiffness}, ${damping}, 0)`
}

export const usePhysics = () => {
  const spring = (
    targets: string | Element | Element[] | NodeList | null,
    properties: Record<string, number | string>,
    springOptions: SpringOptions = {},
    physicsOptions: PhysicsOptions = {}
  ): anime.AnimeInstance => {
    const { duration = 1000, autoplay = true } = physicsOptions
    const easing = createSpringEasing(springOptions)

    return anime({
      targets,
      ...properties,
      duration,
      easing,
      autoplay,
    })
  }

  const bounce = (
    targets: string | Element | Element[] | NodeList | null,
    height: number = 100,
    options: PhysicsOptions = {}
  ): anime.AnimeInstance => {
    const { duration = 800, autoplay = true } = options

    return anime({
      targets,
      translateY: [
        { value: -height, duration: duration * 0.4, easing: 'easeOutQuad' },
        { value: 0, duration: duration * 0.6, easing: 'easeOutBounce' },
      ],
      autoplay,
    })
  }

  const gravity = (
    targets: string | Element | Element[] | NodeList | null,
    options: {
      dropHeight?: number
      bounceHeight?: number
      bounces?: number
      duration?: number
    } = {}
  ): anime.AnimeInstance => {
    const {
      dropHeight = 200,
      bounceHeight = 0.6,
      bounces = 3,
      duration = 1000,
    } = options

    const keyframes = []
    let currentHeight = dropHeight
    let timeShare = 0.5

    // Initial drop
    keyframes.push({
      translateY: dropHeight,
      duration: duration * timeShare,
      easing: 'easeInQuad',
    })

    // Bounces
    for (let i = 0; i < bounces; i++) {
      currentHeight *= bounceHeight
      timeShare *= 0.6

      keyframes.push({
        translateY: -currentHeight,
        duration: duration * timeShare * 0.5,
        easing: 'easeOutQuad',
      })
      keyframes.push({
        translateY: 0,
        duration: duration * timeShare * 0.5,
        easing: 'easeInQuad',
      })
    }

    return anime({
      targets,
      translateY: keyframes,
    })
  }

  const pendulum = (
    targets: string | Element | Element[] | NodeList | null,
    options: {
      angle?: number
      duration?: number
      origin?: string
    } = {}
  ): anime.AnimeInstance => {
    const { angle = 45, duration = 2000, origin = 'top center' } = options

    return anime({
      targets,
      rotate: {
        value: [-angle, angle],
        duration,
        easing: 'easeInOutSine',
      },
      transformOrigin: origin,
      loop: true,
      direction: 'alternate',
    })
  }

  const magnet = (
    targets: string | Element | Element[] | NodeList | null,
    magnetPoint: { x: number; y: number },
    options: {
      strength?: number
      radius?: number
      duration?: number
    } = {}
  ): (() => void) => {
    const { strength = 100, radius = 200, duration = 300 } = options
    const elements = getElements(targets)

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX
      const mouseY = e.clientY

      for (const el of elements) {
        const rect = el.getBoundingClientRect()
        const elX = rect.left + rect.width / 2
        const elY = rect.top + rect.height / 2

        const distX = mouseX - elX
        const distY = mouseY - elY
        const distance = Math.sqrt(distX * distX + distY * distY)

        if (distance < radius) {
          const force = (1 - distance / radius) * strength
          const moveX = (distX / distance) * force
          const moveY = (distY / distance) * force

          anime({
            targets: el,
            translateX: moveX,
            translateY: moveY,
            duration,
            easing: 'easeOutElastic',
          })
        } else {
          anime({
            targets: el,
            translateX: 0,
            translateY: 0,
            duration,
            easing: 'easeOutQuad',
          })
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }

  const velocity = (
    targets: string | Element | Element[] | NodeList | null,
    velocity: { x: number; y: number },
    friction: number = 0.95
  ): (() => void) => {
    const elements = getElements(targets)
    let currentVelocity = { ...velocity }
    let rafId: number | null = null
    let isActive = true

    const animate = () => {
      if (!isActive) return

      currentVelocity.x *= friction
      currentVelocity.y *= friction

      for (const el of elements) {
        const currentX = anime.get(el, 'translateX') as number || 0
        const currentY = anime.get(el, 'translateY') as number || 0

        anime.set(el, {
          translateX: currentX + currentVelocity.x,
          translateY: currentY + currentVelocity.y,
        })
      }

      if (Math.abs(currentVelocity.x) > 0.1 || Math.abs(currentVelocity.y) > 0.1) {
        rafId = requestAnimationFrame(animate)
      }
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      isActive = false
      if (rafId) cancelAnimationFrame(rafId)
    }
  }

  return {
    spring,
    bounce,
    gravity,
    pendulum,
    magnet,
    velocity,
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
