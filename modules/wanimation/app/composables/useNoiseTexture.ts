export interface NoiseTextureOptions {
  opacity?: number
  speed?: number
  grainSize?: number
  monochrome?: boolean
  colors?: string[]
}

export const useNoiseTexture = () => {
  const create = (
    container: HTMLElement | string,
    options: NoiseTextureOptions = {}
  ): { destroy: () => void } => {
    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el || !(el instanceof HTMLElement)) {
      return { destroy: () => {} }
    }

    const {
      opacity = 0.05,
      speed = 100,
      grainSize = 1,
      monochrome = true,
    } = options

    const canvas = document.createElement('canvas')
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: ${opacity};
      z-index: 1;
    `

    el.style.position = 'relative'
    el.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    if (!ctx) return { destroy: () => {} }

    const resize = () => {
      canvas.width = el.offsetWidth / grainSize
      canvas.height = el.offsetHeight / grainSize
    }
    resize()

    let rafId: number
    const animate = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255
        data[i] = monochrome ? value : Math.random() * 255     // R
        data[i + 1] = monochrome ? value : Math.random() * 255 // G
        data[i + 2] = monochrome ? value : Math.random() * 255 // B
        data[i + 3] = 255 // Alpha
      }

      ctx.putImageData(imageData, 0, 0)

      rafId = setTimeout(() => {
        requestAnimationFrame(animate)
      }, speed) as unknown as number
    }

    window.addEventListener('resize', resize)
    animate()

    return {
      destroy: () => {
        clearTimeout(rafId)
        window.removeEventListener('resize', resize)
        canvas.remove()
      },
    }
  }

  return {
    create,
  }
}
