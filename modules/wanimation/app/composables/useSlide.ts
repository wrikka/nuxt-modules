import anime from 'animejs'
import type { AnimationOptions } from '~/types/animation'

export const useSlide = () => {
  const slideUp = (
    targets: string | Element | Element[] | NodeList | null,
    distance = 100,
    duration = 300
  ): Promise<void> => {
    return new Promise((resolve) => {
      anime({
        targets,
        translateY: [distance, 0],
        opacity: [0, 1],
        duration,
        easing: 'easeOutQuad',
        complete: () => resolve(),
      })
    })
  }

  const slideDown = (
    targets: string | Element | Element[] | NodeList | null,
    distance = 100,
    duration = 300
  ): Promise<void> => {
    return new Promise((resolve) => {
      anime({
        targets,
        translateY: [-distance, 0],
        opacity: [0, 1],
        duration,
        easing: 'easeOutQuad',
        complete: () => resolve(),
      })
    })
  }

  const slideLeft = (
    targets: string | Element | Element[] | NodeList | null,
    distance = 100,
    duration = 300
  ): Promise<void> => {
    return new Promise((resolve) => {
      anime({
        targets,
        translateX: [distance, 0],
        opacity: [0, 1],
        duration,
        easing: 'easeOutQuad',
        complete: () => resolve(),
      })
    })
  }

  const slideRight = (
    targets: string | Element | Element[] | NodeList | null,
    distance = 100,
    duration = 300
  ): Promise<void> => {
    return new Promise((resolve) => {
      anime({
        targets,
        translateX: [-distance, 0],
        opacity: [0, 1],
        duration,
        easing: 'easeOutQuad',
        complete: () => resolve(),
      })
    })
  }

  const slideOutUp = (
    targets: string | Element | Element[] | NodeList | null,
    distance = 100,
    duration = 300
  ): Promise<void> => {
    return new Promise((resolve) => {
      anime({
        targets,
        translateY: [0, -distance],
        opacity: [1, 0],
        duration,
        easing: 'easeInQuad',
        complete: () => resolve(),
      })
    })
  }

  const slideOutDown = (
    targets: string | Element | Element[] | NodeList | null,
    distance = 100,
    duration = 300
  ): Promise<void> => {
    return new Promise((resolve) => {
      anime({
        targets,
        translateY: [0, distance],
        opacity: [1, 0],
        duration,
        easing: 'easeInQuad',
        complete: () => resolve(),
      })
    })
  }

  return {
    slideUp,
    slideDown,
    slideLeft,
    slideRight,
    slideOutUp,
    slideOutDown,
  }
}
