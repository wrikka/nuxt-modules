import anime from 'animejs'

export interface ProgressIndicatorOptions {
  color?: string
  height?: number
  position?: 'top' | 'bottom'
  glow?: boolean
  gradient?: boolean
}

export const useProgressIndicator = () => {
  const create = (
    options: ProgressIndicatorOptions = {}
  ): { destroy: () => void } => {
    const {
      color = '#4ecdc4',
      height = 4,
      position = 'top',
      glow = true,
      gradient = true,
    } = options

    const bar = document.createElement('div')
    bar.style.cssText = `
      position: fixed;
      ${position}: 0;
      left: 0;
      width: 0%;
      height: ${height}px;
      background: ${gradient ? `linear-gradient(90deg, ${color}, ${color}88)` : color};
      z-index: 9999;
      transition: none;
      ${glow ? `box-shadow: 0 0 10px ${color};` : ''}
    `

    document.body.appendChild(bar)

    let rafId: number

    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100

      bar.style.width = `${Math.min(100, Math.max(0, progress))}%`
      rafId = requestAnimationFrame(updateProgress)
    }

    rafId = requestAnimationFrame(updateProgress)

    return {
      destroy: () => {
        cancelAnimationFrame(rafId)
        bar.remove()
      },
    }
  }

  return {
    create,
  }
}
