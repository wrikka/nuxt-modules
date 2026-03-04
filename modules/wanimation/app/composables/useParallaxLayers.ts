import { useThrottleFn } from '@vueuse/core'
import anime from 'animejs'

export interface ParallaxLayer {
  element: HTMLElement | string
  speed: number
  direction?: 'vertical' | 'horizontal'
}

export interface ParallaxLayersOptions {
  smoothness?: number
  perspective?: number
}

export const useParallaxLayers = () => {
  const create = (
    layers: ParallaxLayer[],
    options: ParallaxLayersOptions = {}
  ): (() => void) => {
    const { smoothness = 0.1, perspective = 1000 } = options

    // Get all elements
    const layerElements = layers.map(layer => {
      const el = typeof layer.element === 'string'
        ? document.querySelector(layer.element)
        : layer.element
      return { el, speed: layer.speed, direction: layer.direction || 'vertical' }
    }).filter(item => item.el instanceof HTMLElement)

    if (layerElements.length === 0) return () => {}

    // Set up perspective container
    const container = layerElements[0].el!.parentElement
    if (container) {
      container.style.perspective = `${perspective}px`
      container.style.transformStyle = 'preserve-3d'
    }

    let scrollY = 0
    let targetY = 0
    let rafId: number | null = null

    const handleScroll = useThrottleFn(() => {
      targetY = window.scrollY
    }, 16)

    const animate = () => {
      // Smooth scroll interpolation
      scrollY += (targetY - scrollY) * smoothness

      layerElements.forEach(({ el, speed, direction }) => {
        if (!el) return

        const offset = scrollY * speed

        if (direction === 'vertical') {
          anime.set(el, { translateY: offset })
        } else {
          anime.set(el, { translateX: offset })
        }
      })

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }

  return {
    create,
  }
}
