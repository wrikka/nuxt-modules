export interface WaterRippleOptions {
  damping?: number
  radius?: number
  strength?: number
  color?: string
}

export const useWaterRipple = () => {
  const create = (
    container: HTMLElement | string,
    options: WaterRippleOptions = {}
  ): { destroy: () => void; ripple: (x: number, y: number) => void } => {
    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el || !(el instanceof HTMLElement)) {
      return { destroy: () => {}, ripple: () => {} }
    }

    const {
      damping = 0.96,
      radius = 3,
      strength = 256,
    } = options

    const canvas = document.createElement('canvas')
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `

    el.style.position = 'relative'
    el.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    if (!ctx) return { destroy: () => {}, ripple: () => {} }

    const resize = () => {
      canvas.width = el.offsetWidth
      canvas.height = el.offsetHeight
    }
    resize()

    // Two buffers for ripple simulation
    let buffer1: number[] = []
    let buffer2: number[] = []

    const initBuffers = () => {
      const size = canvas.width * canvas.height
      buffer1 = new Array(size).fill(0)
      buffer2 = new Array(size).fill(0)
    }
    initBuffers()

    let rafId: number

    const processRipples = () => {
      const width = canvas.width
      const height = canvas.height

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const index = y * width + x

          // Average of neighbors
          let val = (
            buffer1[index - 1] +
            buffer1[index + 1] +
            buffer1[index - width] +
            buffer1[index + width]
          ) / 2 - buffer2[index]

          val *= damping
          buffer2[index] = val
        }
      }

      // Swap buffers
      const temp = buffer1
      buffer1 = buffer2
      buffer2 = temp

      // Render
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      for (let i = 0; i < buffer1.length; i++) {
        const val = buffer1[i]
        const offset = i * 4

        // Create ripple effect
        const intensity = Math.max(0, Math.min(255, Math.abs(val) + 128))
        data[offset] = intensity
        data[offset + 1] = intensity
        data[offset + 2] = intensity
        data[offset + 3] = Math.abs(val) > 1 ? 50 : 0 // Alpha
      }

      ctx.putImageData(imageData, 0, 0)
      rafId = requestAnimationFrame(processRipples)
    }

    const ripple = (x: number, y: number) => {
      const index = Math.floor(y) * canvas.width + Math.floor(x)
      if (index >= 0 && index < buffer1.length) {
        buffer1[index] = strength
      }
    }

    // Click handler
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      ripple(e.clientX - rect.left, e.clientY - rect.top)
    }

    canvas.addEventListener('click', handleClick)

    window.addEventListener('resize', resize)
    rafId = requestAnimationFrame(processRipples)

    return {
      destroy: () => {
        cancelAnimationFrame(rafId)
        canvas.removeEventListener('click', handleClick)
        window.removeEventListener('resize', resize)
        canvas.remove()
      },
      ripple,
    }
  }

  return {
    create,
  }
}
