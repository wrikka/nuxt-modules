import anime from 'animejs'

export interface MarqueeOptions {
  direction?: 'left' | 'right' | 'up' | 'down'
  speed?: number
  pauseOnHover?: boolean
  pauseOnClick?: boolean
  gap?: number
  duplicateCount?: number
}

export const useMarquee = () => {
  const create = (
    container: HTMLElement | string,
    options: MarqueeOptions = {}
  ): { destroy: () => void; pause: () => void; resume: () => void } => {
    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el || !(el instanceof HTMLElement)) {
      return { destroy: () => {}, pause: () => {}, resume: () => {} }
    }

    const {
      direction = 'left',
      speed = 50,
      pauseOnHover = false,
      pauseOnClick = false,
      duplicateCount = 2,
    } = options

    // Get original content
    const originalContent = el.innerHTML

    // Create wrapper
    const wrapper = document.createElement('div')
    wrapper.style.cssText = `
      display: flex;
      overflow: hidden;
      width: 100%;
      position: relative;
    `

    // Create inner container
    const inner = document.createElement('div')
    inner.className = 'marquee-inner'
    inner.style.cssText = `
      display: flex;
      flex-shrink: 0;
    `

    // Duplicate content
    for (let i = 0; i < duplicateCount; i++) {
      const item = document.createElement('div')
      item.className = 'marquee-item'
      item.style.cssText = `
        flex-shrink: 0;
        display: flex;
        align-items: center;
      `
      item.innerHTML = originalContent
      inner.appendChild(item)
    }

    // Clear and append
    el.innerHTML = ''
    wrapper.appendChild(inner)
    el.appendChild(wrapper)

    // Calculate animation
    const isHorizontal = direction === 'left' || direction === 'right'
    const itemWidth = isHorizontal ? inner.scrollWidth / duplicateCount : inner.scrollHeight / duplicateCount
    const duration = (itemWidth / speed) * 1000

    const getFromTo = () => {
      if (direction === 'left') return { x: [0, -itemWidth] }
      if (direction === 'right') return { x: [-itemWidth, 0] }
      if (direction === 'up') return { y: [0, -itemWidth] }
      return { y: [-itemWidth, 0] }
    }

    const anim = anime({
      targets: inner,
      ...getFromTo(),
      duration,
      easing: 'linear',
      loop: true,
    })

    // Add pause handlers
    if (pauseOnHover) {
      el.addEventListener('mouseenter', () => anim.pause())
      el.addEventListener('mouseleave', () => anim.play())
    }

    if (pauseOnClick) {
      el.addEventListener('click', () => {
        if (anim.paused) anim.play()
        else anim.pause()
      })
    }

    return {
      destroy: () => {
        anim.pause()
        anime.remove(inner)
        el.innerHTML = originalContent
      },
      pause: () => anim.pause(),
      resume: () => anim.play(),
    }
  }

  return {
    create,
  }
}
