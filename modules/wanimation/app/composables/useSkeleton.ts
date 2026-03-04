import anime from 'animejs'

export interface SkeletonOptions {
  baseColor?: string
  highlightColor?: string
  animationDuration?: number
  borderRadius?: number
  direction?: 'left' | 'right' | 'up' | 'down'
}

export const useSkeleton = () => {
  const create = (
    element: HTMLElement | string,
    options: SkeletonOptions = {}
  ): { start: () => void; stop: () => void } => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return { start: () => {}, stop: () => {} }
    }

    const {
      baseColor = '#e0e0e0',
      highlightColor = '#f0f0f0',
      animationDuration = 1500,
      borderRadius = 4,
      direction = 'right',
    } = options

    const originalContent = el.innerHTML
    const originalStyles = el.style.cssText

    let animation: anime.AnimeInstance | null = null

    const start = () => {
      // Apply skeleton styles
      el.style.backgroundColor = baseColor
      el.style.borderRadius = `${borderRadius}px`
      el.style.overflow = 'hidden'
      el.style.position = 'relative'

      // Hide original content
      for (const child of el.children) {
        ;(child as HTMLElement).style.visibility = 'hidden'
      }

      // Create shimmer element
      const shimmer = document.createElement('div')
      shimmer.className = 'skeleton-shimmer'
      shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent 0%,
          ${highlightColor} 50%,
          transparent 100%
        );
        transform: translateX(-100%);
      `
      el.appendChild(shimmer)

      // Animate shimmer
      animation = anime({
        targets: shimmer,
        translateX: ['-100%', '100%'],
        duration: animationDuration,
        easing: 'easeInOutSine',
        loop: true,
      })
    }

    const stop = () => {
      animation?.pause()
      el.innerHTML = originalContent
      el.style.cssText = originalStyles
    }

    return { start, stop }
  }

  const createCard = (
    element: HTMLElement | string,
    options: SkeletonOptions & { lines?: number; hasImage?: boolean } = {}
  ): { start: () => void; stop: () => void } => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return { start: () => {}, stop: () => {} }
    }

    const {
      baseColor = '#e0e0e0',
      highlightColor = '#f0f0f0',
      animationDuration = 1500,
      borderRadius = 4,
      lines = 3,
      hasImage = true,
    } = options

    const originalContent = el.innerHTML
    const originalStyles = el.style.cssText

    let animation: anime.AnimeInstance | null = null

    const start = () => {
      el.innerHTML = ''
      el.style.cssText = `
        ${originalStyles}
        padding: 16px;
        background: white;
        border-radius: ${borderRadius * 2}px;
      `

      const container = document.createElement('div')
      container.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 12px;
      `

      // Image placeholder
      if (hasImage) {
        const image = document.createElement('div')
        image.style.cssText = `
          width: 100%;
          height: 150px;
          background: ${baseColor};
          border-radius: ${borderRadius}px;
        `
        container.appendChild(image)
      }

      // Title placeholder
      const title = document.createElement('div')
      title.style.cssText = `
        width: 60%;
        height: 20px;
        background: ${baseColor};
        border-radius: ${borderRadius}px;
      `
      container.appendChild(title)

      // Line placeholders
      for (let i = 0; i < lines; i++) {
        const line = document.createElement('div')
        line.style.cssText = `
          width: ${i === lines - 1 ? '40%' : '100%'};
          height: 14px;
          background: ${baseColor};
          border-radius: ${borderRadius}px;
        `
        container.appendChild(line)
      }

      el.appendChild(container)

      // Create shimmer overlay
      const shimmer = document.createElement('div')
      shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent 0%,
          ${highlightColor} 50%,
          transparent 100%
        );
        transform: translateX(-100%);
        pointer-events: none;
      `
      el.style.position = 'relative'
      el.style.overflow = 'hidden'
      el.appendChild(shimmer)

      animation = anime({
        targets: shimmer,
        translateX: ['-100%', '100%'],
        duration: animationDuration,
        easing: 'easeInOutSine',
        loop: true,
      })
    }

    const stop = () => {
      animation?.pause()
      el.innerHTML = originalContent
      el.style.cssText = originalStyles
    }

    return { start, stop }
  }

  const createAvatar = (
    element: HTMLElement | string,
    options: SkeletonOptions & { size?: number } = {}
  ): { start: () => void; stop: () => void } => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return { start: () => {}, stop: () => {} }
    }

    const {
      baseColor = '#e0e0e0',
      highlightColor = '#f0f0f0',
      animationDuration = 1500,
      size = 48,
    } = options

    const originalContent = el.innerHTML
    const originalStyles = el.style.cssText

    let animation: anime.AnimeInstance | null = null

    const start = () => {
      el.innerHTML = ''
      el.style.cssText = `
        ${originalStyles}
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${baseColor};
        position: relative;
        overflow: hidden;
      `

      const shimmer = document.createElement('div')
      shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent 0%,
          ${highlightColor} 50%,
          transparent 100%
        );
        transform: translateX(-100%);
      `
      el.appendChild(shimmer)

      animation = anime({
        targets: shimmer,
        translateX: ['-100%', '100%'],
        duration: animationDuration,
        easing: 'easeInOutSine',
        loop: true,
      })
    }

    const stop = () => {
      animation?.pause()
      el.innerHTML = originalContent
      el.style.cssText = originalStyles
    }

    return { start, stop }
  }

  const pulse = (
    element: HTMLElement | string,
    options: { duration?: number; opacity?: [number, number] } = {}
  ): anime.AnimeInstance => {
    const { duration = 1500, opacity = [0.6, 1] } = options

    return anime({
      targets: element,
      opacity,
      duration,
      easing: 'easeInOutSine',
      loop: true,
      direction: 'alternate',
    })
  }

  return {
    create,
    createCard,
    createAvatar,
    pulse,
  }
}
