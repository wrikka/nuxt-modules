export interface WebGLParticleOptions {
  count?: number
  size?: number
  color?: string | string[]
  speed?: number
  opacity?: number
  blending?: 'normal' | 'additive'
  shape?: 'circle' | 'square' | 'triangle'
  gravity?: number
  wind?: number
  bounds?: 'bounce' | 'wrap' | 'fade'
}

export const useWebGLParticles = () => {
  const createCanvas = (container: HTMLElement, width: number, height: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `
    container.style.position = 'relative'
    container.appendChild(canvas)
    return canvas
  }

  const createParticleSystem = (
    container: HTMLElement | string,
    options: WebGLParticleOptions = {}
  ): { destroy: () => void; pause: () => void; resume: () => void } => {
    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el || !(el instanceof HTMLElement)) {
      return { destroy: () => {}, pause: () => {}, resume: () => {} }
    }

    const {
      count = 100,
      size = 4,
      color = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'],
      speed = 1,
      opacity = 0.8,
      gravity = 0.1,
      wind = 0,
      bounds = 'bounce',
    } = options

    const canvas = createCanvas(el, el.offsetWidth, el.offsetHeight)
    const ctx = canvas.getContext('2d')
    if (!ctx) return { destroy: () => {}, pause: () => {}, resume: () => {} }

    const colors = Array.isArray(color) ? color : [color]

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      alpha: number
      life: number
      maxLife: number
    }

    const particles: Particle[] = []
    let isPaused = false
    let rafId: number | null = null

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
      size: size * (0.5 + Math.random() * 0.5),
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: opacity,
      life: 1,
      maxLife: 100 + Math.random() * 100,
    })

    // Initialize particles
    for (let i = 0; i < count; i++) {
      particles.push(createParticle())
    }

    const updateParticle = (p: Particle) => {
      p.vy += gravity
      p.vx += wind * 0.01
      p.x += p.vx
      p.y += p.vy
      p.life--
      p.alpha = (p.life / p.maxLife) * opacity

      // Handle bounds
      if (bounds === 'bounce') {
        if (p.x < 0 || p.x > canvas.width) p.vx *= -0.8
        if (p.y < 0 || p.y > canvas.height) p.vy *= -0.8
        p.x = Math.max(0, Math.min(canvas.width, p.x))
        p.y = Math.max(0, Math.min(canvas.height, p.y))
      } else if (bounds === 'wrap') {
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      } else if (bounds === 'fade') {
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          p.life = 0
        }
      }

      // Respawn dead particles
      if (p.life <= 0) {
        const newP = createParticle()
        Object.assign(p, newP)
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
    }

    const animate = () => {
      if (isPaused) return

      for (const p of particles) {
        updateParticle(p)
      }
      draw()
      rafId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = el.offsetWidth
      canvas.height = el.offsetHeight
    }

    window.addEventListener('resize', handleResize)
    animate()

    return {
      destroy: () => {
        if (rafId) cancelAnimationFrame(rafId)
        window.removeEventListener('resize', handleResize)
        canvas.remove()
      },
      pause: () => {
        isPaused = true
        if (rafId) cancelAnimationFrame(rafId)
      },
      resume: () => {
        isPaused = false
        animate()
      },
    }
  }

  const createBurst = (
    container: HTMLElement | string,
    x: number,
    y: number,
    options: WebGLParticleOptions & { burstCount?: number } = {}
  ): void => {
    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el || !(el instanceof HTMLElement)) return

    const { burstCount = 30, color = '#ff6b6b', speed = 5 } = options
    const colors = Array.isArray(color) ? color : [color]

    const canvas = createCanvas(el, el.offsetWidth, el.offsetHeight)
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      life: number
    }> = []

    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 * i) / burstCount
      const velocity = speed * (0.5 + Math.random())
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: 3 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 60,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let alive = false
      for (const p of particles) {
        if (p.life > 0) {
          alive = true
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.2 // gravity
          p.vx *= 0.98 // drag
          p.vy *= 0.98
          p.life--

          ctx.globalAlpha = p.life / 60
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (alive) {
        requestAnimationFrame(animate)
      } else {
        canvas.remove()
      }
    }

    animate()
  }

  return {
    createParticleSystem,
    createBurst,
  }
}
