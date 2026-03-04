import anime from 'animejs'

export interface GlitchOptions {
  duration?: number
  intensity?: number
  frequency?: number
  direction?: 'horizontal' | 'vertical' | 'both'
}

export const useGlitch = () => {
  const apply = (
    element: HTMLElement | string,
    options: GlitchOptions = {}
  ): { start: () => void; stop: () => void } => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return { start: () => {}, stop: () => {} }
    }

    const {
      duration = 2000,
      intensity = 10,
      frequency = 100,
      direction = 'horizontal',
    } = options

    let isRunning = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let anim: anime.AnimeInstance | null = null

    const glitch = () => {
      if (!isRunning) return

      const offsetX = direction !== 'vertical'
        ? (Math.random() - 0.5) * intensity
        : 0
      const offsetY = direction !== 'horizontal'
        ? (Math.random() - 0.5) * intensity * 0.5
        : 0

      const clipPath = `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`

      anim = anime({
        targets: el,
        translateX: offsetX,
        translateY: offsetY,
        clipPath: [clipPath, 'inset(0 0 0 0)'],
        opacity: Math.random() > 0.8 ? 0.8 : 1,
        duration: 50,
        easing: 'steps(1)',
        complete: () => {
          if (isRunning) {
            timeoutId = setTimeout(glitch, Math.random() * frequency)
          }
        },
      })
    }

    const start = () => {
      if (isRunning) return
      isRunning = true
      el.style.position = 'relative'
      glitch()
    }

    const stop = () => {
      isRunning = false
      if (timeoutId) clearTimeout(timeoutId)
      if (anim) anim.pause()
      anime.remove(el)
      el.style.transform = ''
      el.style.clipPath = ''
      el.style.opacity = ''
    }

    return { start, stop }
  }

  const burst = (
    element: HTMLElement | string,
    options: GlitchOptions = {}
  ): Promise<void> => {
    return new Promise((resolve) => {
      const el = typeof element === 'string'
        ? document.querySelector(element)
        : element

      if (!el || !(el instanceof HTMLElement)) {
        resolve()
        return
      }

      const { duration = 500, intensity = 20 } = options

      const steps = Math.floor(duration / 50)
      const keyframes = []

      for (let i = 0; i < steps; i++) {
        keyframes.push({
          translateX: (Math.random() - 0.5) * intensity,
          translateY: (Math.random() - 0.5) * intensity * 0.3,
          skewX: (Math.random() - 0.5) * intensity * 2,
          opacity: Math.random() > 0.7 ? 0.5 : 1,
        })
      }

      keyframes.push({ translateX: 0, translateY: 0, skewX: 0, opacity: 1 })

      anime({
        targets: el,
        keyframes,
        duration,
        easing: 'steps(1)',
        complete: resolve,
      })
    })
  }

  return {
    apply,
    burst,
  }
}
