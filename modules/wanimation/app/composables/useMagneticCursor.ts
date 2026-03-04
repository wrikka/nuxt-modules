import { useEventListener, useThrottleFn } from '@vueuse/core'

export interface MagneticCursorOptions {
  strength?: number
  radius?: number
  ease?: number
  maxOffset?: number
}

export const useMagneticCursor = () => {
  const attach = (
    element: HTMLElement | string,
    options: MagneticCursorOptions = {}
  ): (() => void) => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) return () => {}

    const {
      strength = 0.5,
      radius = 100,
      ease = 0.15,
      maxOffset = 30,
    } = options

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let rafId: number | null = null

    const handleMouseMove = useThrottleFn((e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const distance = Math.sqrt(distX * distX + distY * distY)

      if (distance < radius) {
        const force = (1 - distance / radius) * strength
        targetX = Math.max(-maxOffset, Math.min(maxOffset, distX * force))
        targetY = Math.max(-maxOffset, Math.min(maxOffset, distY * force))
      } else {
        targetX = 0
        targetY = 0
      }
    }, 16)

    const animate = () => {
      currentX += (targetX - currentX) * ease
      currentY += (targetY - currentY) * ease

      el.style.transform = `translate(${currentX}px, ${currentY}px)`

      if (Math.abs(currentX - targetX) > 0.01 || Math.abs(currentY - targetY) > 0.01) {
        rafId = requestAnimationFrame(animate)
      } else {
        rafId = null
      }
    }

    const startAnimation = () => {
      if (!rafId) rafId = requestAnimationFrame(animate)
    }

    const handleMouseEnter = () => {
      el.style.transition = 'none'
      startAnimation()
    }

    const handleMouseLeave = () => {
      targetX = 0
      targetY = 0
      startAnimation()
      el.style.transition = `transform 0.3s ease-out`
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseenter', handleMouseEnter)
      el.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }

  const group = (
    container: HTMLElement | string,
    options: MagneticCursorOptions & { selector?: string } = {}
  ): (() => void) => {
    const { selector = '.magnetic', ...cursorOptions } = options

    const containerEl = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!containerEl || !(containerEl instanceof HTMLElement)) return () => {}

    const elements = containerEl.querySelectorAll(selector)
    const cleanups: Array<() => void> = []

    for (const el of elements) {
      if (el instanceof HTMLElement) {
        cleanups.push(attach(el, cursorOptions))
      }
    }

    return () => cleanups.forEach(cleanup => cleanup())
  }

  return {
    attach,
    group,
  }
}
