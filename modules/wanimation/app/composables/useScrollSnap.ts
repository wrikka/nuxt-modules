import { useEventListener } from '@vueuse/core'

export interface ScrollSnapOptions {
  snapTo?: 'start' | 'center' | 'end' | 'nearest'
  mandatory?: boolean
  axis?: 'x' | 'y' | 'both'
  proximity?: number
}

export const useScrollSnap = () => {
  const apply = (
    container: HTMLElement | string,
    options: ScrollSnapOptions = {}
  ): (() => void) => {
    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el || !(el instanceof HTMLElement)) return () => {}

    const {
      snapTo = 'start',
      mandatory = true,
      axis = 'y',
    } = options

    const scrollSnapType = `${axis} ${mandatory ? 'mandatory' : 'proximity'}`
    const scrollSnapAlign = snapTo

    el.style.scrollSnapType = scrollSnapType
    el.style.overflow = axis === 'y' ? 'scroll' : 'auto'

    // Apply to children
    const children = el.children
    for (const child of children) {
      if (child instanceof HTMLElement) {
        child.style.scrollSnapAlign = scrollSnapAlign
      }
    }

    return () => {
      el.style.scrollSnapType = ''
      for (const child of children) {
        if (child instanceof HTMLElement) {
          child.style.scrollSnapAlign = ''
        }
      }
    }
  }

  const snapTo = (
    element: HTMLElement | string,
    behavior: 'smooth' | 'auto' = 'smooth',
    block: 'start' | 'center' | 'end' | 'nearest' = 'start'
  ): void => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof Element)) return

    el.scrollIntoView({ behavior, block })
  }

  return {
    apply,
    snapTo,
  }
}
