export interface FireSparksOptions {
  count?: number
  intensity?: number
  color?: string
  spread?: number
  riseSpeed?: number
}

export const useFireSparks = () => {
  const create = (
    container: HTMLElement | string,
    options: FireSparksOptions = {}
  ): { destroy: () => void } => {
    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el || !(el instanceof HTMLElement)) {
      return { destroy: () => {} }
    }

    const {
      count = 50,
      intensity = 1,
      color = '#ff6b35',
      spread = 100,
      riseSpeed = 2,
    } = options

    const canvas = document.createElement('canvas')
    canvas.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
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

    interface Spark {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
      life: number
      maxLife: number
      color: string
    }

    const particles: Spark[] = []
    const colors = ['#ff6b35', '#f7931e', '#ffd23f', '#ff6b6b']

    const createSpark = (): Spark => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * spread,
      y: canvas.height - 10,
      vx: (Math.random() - 0.5) * 2,
      vy: -riseSpeed * (1 + Math.random() * 2),
      size: 1 + Math.random() * 3,
      alpha: 1,
      life: 0,
      maxLife: 60 + Math.random() * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
    })

    // Initialize
    for (let i = 0; i < count; i++) {
      const p = createSpark()
      p.y = canvas.height - Math.random() * 200
      p.life = Math.random() * p.maxLife
      particles.push(p)
    }

    let rafId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'screen'

      for (const p of particles) {
        p.x += p.vx + (Math.random() - 0.5) * 0.5
        p.y += p.vy
        p.vx += (Math.random() - 0.5) * 0.1
        p.life++

        // Fade out
        p.alpha = 1 - (p.life / p.maxLife)

        // Reset dead particles
        if (p.life >= p.maxLife || p.y < 0) {
          Object.assign(p, createSpark())
        }

        // Draw with glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        gradient.addColorStop(0, p.color)
        gradient.addColorStop(0.4, p.color + '80')
        gradient.addColorStop(1, 'transparent')

        ctx.globalAlpha = p.alpha
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
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

  const burst = (
    container: HTMLElement | string,
    x: number,
    y: number,
    options: { count?: number; intensity?: number } = {}
  ): void => {
    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el || !(el instanceof HTMLElement)) return

    const { count = 20, intensity = 1 } = options
    const colors = ['#ff6b35', '#f7931e', '#ffd23f']

    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div')
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const velocity = 3 + Math.random() * 5 * intensity

      spark.style.cssText = `
        position: absolute;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        box-shadow: 0 0 10px currentColor;
      `
      el.appendChild(spark)

      const anim = spark.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(angle) * velocity * 20}px, ${Math.sin(angle) * velocity * 20}px) scale(0)`, opacity: 0 },
      ], {
        duration: 600 + Math.random() * 400,
        easing: 'ease-out',
      })

      anim.onfinish = () => spark.remove()
    }
  }

  return {
    create,
    burst,
  }
}
