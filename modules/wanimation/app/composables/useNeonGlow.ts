import anime from 'animejs'

export interface NeonGlowOptions {
  color?: string
  intensity?: number
  speed?: number
  blur?: number
  pulse?: boolean
  flicker?: boolean
}

export const useNeonGlow = () => {
  const apply = (
    element: HTMLElement | string,
    options: NeonGlowOptions = {}
  ): { start: () => void; stop: () => void } => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return { start: () => {}, stop: () => {} }
    }

    const {
      color = '#00ffff',
      intensity = 20,
      speed = 2000,
      blur = 20,
      pulse = true,
      flicker = false,
    } = options

    let anim: anime.AnimeInstance | null = null
    let flickerTimeout: ReturnType<typeof setTimeout> | null = null

    const start = () => {
      // Apply neon styles
      el.style.textShadow = `
        0 0 ${blur}px ${color},
        0 0 ${blur * 2}px ${color},
        0 0 ${blur * 3}px ${color}
      `
      el.style.boxShadow = `
        0 0 ${blur}px ${color},
        inset 0 0 ${blur / 2}px ${color}
      `
      el.style.borderColor = color

      // Pulse animation
      if (pulse) {
        anim = anime({
          targets: el,
          textShadow: [
            `0 0 ${blur}px ${color}, 0 0 ${blur * 2}px ${color}, 0 0 ${blur * 3}px ${color}`,
            `0 0 ${blur * 1.5}px ${color}, 0 0 ${blur * 3}px ${color}, 0 0 ${blur * 4}px ${color}`,
            `0 0 ${blur}px ${color}, 0 0 ${blur * 2}px ${color}, 0 0 ${blur * 3}px ${color}`,
          ],
          boxShadow: [
            `0 0 ${blur}px ${color}, inset 0 0 ${blur / 2}px ${color}`,
            `0 0 ${blur * 1.5}px ${color}, inset 0 0 ${blur}px ${color}`,
            `0 0 ${blur}px ${color}, inset 0 0 ${blur / 2}px ${color}`,
          ],
          duration: speed,
          loop: true,
          easing: 'easeInOutSine',
        })
      }

      // Flicker effect
      if (flicker) {
        const flickerFn = () => {
          el.style.opacity = Math.random() > 0.9 ? '0.5' : '1'
          flickerTimeout = setTimeout(flickerFn, Math.random() * 100 + 50)
        }
        flickerFn()
      }
    }

    const stop = () => {
      if (anim) anim.pause()
      if (flickerTimeout) clearTimeout(flickerTimeout)
      el.style.textShadow = ''
      el.style.boxShadow = ''
      el.style.opacity = ''
      anime.remove(el)
    }

    return { start, stop }
  }

  const rainbow = (
    element: HTMLElement | string,
    options: { speed?: number; blur?: number } = {}
  ): { start: () => void; stop: () => void } => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return { start: () => {}, stop: () => {} }
    }

    const { speed = 3000, blur = 20 } = options
    let anim: anime.AnimeInstance | null = null

    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']

    const start = () => {
      anim = anime({
        targets: el,
        color: colors,
        textShadow: colors.map(c => `0 0 ${blur}px ${c}, 0 0 ${blur * 2}px ${c}`),
        boxShadow: colors.map(c => `0 0 ${blur}px ${c}, inset 0 0 ${blur / 2}px ${c}`),
        borderColor: colors,
        duration: speed,
        loop: true,
        easing: 'linear',
      })
    }

    const stop = () => {
      if (anim) anim.pause()
      anime.remove(el)
      el.style.textShadow = ''
      el.style.boxShadow = ''
    }

    return { start, stop }
  }

  return {
    apply,
    rainbow,
  }
}
