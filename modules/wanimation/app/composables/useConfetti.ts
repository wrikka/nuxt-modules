import anime from 'animejs'

export interface ConfettiOptions {
  particleCount?: number
  spread?: number
  origin?: { x: number; y: number }
  colors?: string[]
  shapes?: Array<'circle' | 'square' | 'triangle'>
  gravity?: number
  scalar?: number
  drift?: number
  ticks?: number
  startVelocity?: number
  decay?: number
  zIndex?: number
  disableForReducedMotion?: boolean
}

interface Particle {
  element: HTMLElement
  x: number
  y: number
  vx: number
  vy: number
  gravity: number
  drag: number
  color: string
  shape: string
  scalar: number
  rotation: number
  rotationSpeed: number
  life: number
}

export const useConfetti = () => {
  const fire = (options: ConfettiOptions = {}): Promise<void> => {
    return new Promise((resolve) => {
      // Check reduced motion preference
      if (options.disableForReducedMotion !== false) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) {
          resolve()
          return
        }
      }

      const {
        particleCount = 100,
        spread = 360,
        origin = { x: 0.5, y: 0.5 },
        colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
        shapes = ['circle', 'square', 'triangle'],
        gravity = 0.5,
        scalar = 1,
        drift = 0,
        ticks = 200,
        startVelocity = 45,
        decay = 0.9,
        zIndex = 100,
      } = options

      // Create container
      const container = document.createElement('div')
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: ${zIndex};
        overflow: hidden;
      `
      document.body.appendChild(container)

      const particles: Particle[] = []

      // Create particles
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(
          container,
          origin,
          spread,
          startVelocity,
          gravity,
          decay,
          drift,
          colors,
          shapes,
          scalar
        )
        particles.push(particle)
      }

      let frame = 0
      const maxFrames = ticks

      const animate = () => {
        frame++

        for (const particle of particles) {
          updateParticle(particle)
        }

        if (frame < maxFrames && particles.some(p => p.life > 0)) {
          requestAnimationFrame(animate)
        } else {
          container.remove()
          resolve()
        }
      }

      animate()
    })
  }

  const burst = (
    x: number,
    y: number,
    options: ConfettiOptions = {}
  ): Promise<void> => {
    return fire({
      ...options,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      spread: options.spread || 120,
      particleCount: options.particleCount || 30,
    })
  }

  const cannon = (
    originX: number,
    originY: number,
    targetX: number,
    targetY: number,
    options: ConfettiOptions = {}
  ): Promise<void> => {
    return new Promise((resolve) => {
      const {
        particleCount = 50,
        colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'],
        scalar = 1,
        zIndex = 100,
      } = options

      const container = document.createElement('div')
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: ${zIndex};
        overflow: hidden;
      `
      document.body.appendChild(container)

      const particles: Particle[] = []

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.atan2(targetY - originY, targetX - originX)
        const spreadAngle = (Math.random() - 0.5) * 0.5
        const velocity = 10 + Math.random() * 10

        const element = document.createElement('div')
        element.style.cssText = `
          position: absolute;
          width: ${8 * scalar}px;
          height: ${8 * scalar}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: 50%;
          left: ${originX}px;
          top: ${originY}px;
        `
        container.appendChild(element)

        particles.push({
          element,
          x: originX,
          y: originY,
          vx: Math.cos(angle + spreadAngle) * velocity,
          vy: Math.sin(angle + spreadAngle) * velocity,
          gravity: 0.3,
          drag: 0.98,
          color: '',
          shape: '',
          scalar,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 20,
          life: 100,
        })
      }

      const animate = () => {
        let active = false

        for (const p of particles) {
          if (p.life <= 0) continue
          active = true

          p.x += p.vx
          p.y += p.vy
          p.vy += p.gravity
          p.vx *= p.drag
          p.vy *= p.drag
          p.rotation += p.rotationSpeed
          p.life--

          p.element.style.left = `${p.x}px`
          p.element.style.top = `${p.y}px`
          p.element.style.transform = `rotate(${p.rotation}deg)`
          p.element.style.opacity = `${p.life / 100}`
        }

        if (active) {
          requestAnimationFrame(animate)
        } else {
          container.remove()
          resolve()
        }
      }

      animate()
    })
  }

  const createParticle = (
    container: HTMLElement,
    origin: { x: number; y: number },
    spread: number,
    startVelocity: number,
    gravity: number,
    decay: number,
    drift: number,
    colors: string[],
    shapes: string[],
    scalar: number
  ): Particle => {
    const element = document.createElement('div')
    const color = colors[Math.floor(Math.random() * colors.length)]
    const shape = shapes[Math.floor(Math.random() * shapes.length)]

    const size = (5 + Math.random() * 5) * scalar

    let borderRadius = '50%'
    let clipPath = ''

    if (shape === 'square') {
      borderRadius = '0'
    } else if (shape === 'triangle') {
      clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'
    }

    element.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${borderRadius};
      clip-path: ${clipPath};
      left: ${origin.x * 100}%;
      top: ${origin.y * 100}%;
    `

    container.appendChild(element)

    const angle = (Math.random() - 0.5) * spread * (Math.PI / 180)
    const velocity = startVelocity * (0.5 + Math.random() * 0.5)

    return {
      element,
      x: origin.x * window.innerWidth,
      y: origin.y * window.innerHeight,
      vx: Math.sin(angle) * velocity,
      vy: -Math.cos(angle) * velocity,
      gravity,
      drag: decay,
      color,
      shape,
      scalar,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      life: 1,
    }
  }

  const updateParticle = (particle: Particle): void => {
    if (particle.life <= 0) return

    particle.x += particle.vx
    particle.y += particle.vy
    particle.vy += particle.gravity
    particle.vx *= particle.drag
    particle.vy *= particle.drag
    particle.x += particle.vx * 0.1 // drift
    particle.rotation += particle.rotationSpeed
    particle.life -= 0.01

    particle.element.style.left = `${particle.x}px`
    particle.element.style.top = `${particle.y}px`
    particle.element.style.transform = `rotate(${particle.rotation}deg)`
    particle.element.style.opacity = `${particle.life}`

    if (particle.y > window.innerHeight || particle.life <= 0) {
      particle.life = 0
      particle.element.style.display = 'none'
    }
  }

  return {
    fire,
    burst,
    cannon,
  }
}
