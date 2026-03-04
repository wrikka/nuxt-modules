import anime from 'animejs'

export interface VignetteOptions {
  color?: string
  intensity?: number
  size?: number
  pulse?: boolean
  pulseSpeed?: number
}

export const useVignette = () => {
  const apply = (
    container: HTMLElement | string,
    options: VignetteOptions = {}
  ): { destroy: () => void } => {
    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el || !(el instanceof HTMLElement)) {
      return { destroy: () => {} }
    }

    const {
      color = '#000000',
      intensity = 0.5,
      size = 100,
      pulse = true,
      pulseSpeed = 2000,
    } = options

    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
      background: radial-gradient(
        ellipse at center,
        transparent ${100 - size}%,
        ${color} 100%
      );
      opacity: ${intensity};
    `

    el.style.position = 'relative'
    el.appendChild(overlay)

    let anim: anime.AnimeInstance | null = null

    if (pulse) {
      anim = anime({
        targets: overlay,
        opacity: [intensity * 0.5, intensity],
        duration: pulseSpeed,
        easing: 'easeInOutSine',
        loop: true,
        direction: 'alternate',
      })
    }

    return {
      destroy: () => {
        if (anim) anim.pause()
        overlay.remove()
      },
    }
  }

  return {
    apply,
  }
}
