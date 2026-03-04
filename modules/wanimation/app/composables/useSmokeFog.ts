export interface SmokeFogOptions {
  count?: number
  color?: string
  speed?: number
  opacity?: number
  spread?: number
}

export const useSmokeFog = () => {
  const create = (
    container: HTMLElement | string,
    options: SmokeFogOptions = {}
  ): { destroy: () => void } => {
    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el || !(el instanceof HTMLElement)) {
      return { destroy: () => {} }
    }

    const {
      count = 20,
      color = '#ffffff',
      speed = 1,
      opacity = 0.3,
      spread = 100,
    } = options

    const canvas = document.createElement('canvas')
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `
    el.style.position = 'relative'
    el.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    if (!ctx) return { destroy: () => {} }

    const resize = () => {
      canvas.width = el.offsetWidth
      canvas.height = el.offsetHeight
    }
    resize()

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
      life: number
    }

    const particles: Particle[] = []

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      vx: (Math.random() - 0.5) * spread * 0.01,
      vy: -speed * (0.5 + Math.random()),
      size: 30 + Math.random() * 50,
      alpha: 0,
      life: 0,
    })

    // Initialize
    for (let i = 0; i < count; i++) {
      const p = createParticle()
      p.y = Math.random() * canvas.height
      p.life = Math.random() * 200
      particles.push(p)
    }

    let rafId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.life++

        // Fade in/out
        if (p.life < 50) {
          p.alpha = (p.life / 50) * opacity
        } else if (p.life > 150) {
          p.alpha = (1 - (p.life - 150) / 50) * opacity
        }

        // Reset dead particles
        if (p.life > 200 || p.y < -100) {
          Object.assign(p, createParticle())
        }

        // Draw
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, 'transparent')

        ctx.globalAlpha = p.alpha
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resize)
    animate()

    return {
      destroy: () => {
        cancelAnimationFrame(rafId)
        window.removeEventListener('resize', resize)
        canvas.remove()
      },
    }
  }

  return {
    create,
  }
}
