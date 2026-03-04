import { usePreferredReducedMotion } from '@vueuse/core'
import type { AnimationOptions } from '~/types/animation'

export interface ReducedMotionOptions {
  skipAnimation?: boolean
  instantDuration?: boolean
  fadeOnly?: boolean
}

export const useReducedMotion = (options: ReducedMotionOptions = {}) => {
  const prefersReducedMotion = usePreferredReducedMotion()

  const { skipAnimation = false, instantDuration = true, fadeOnly = false } = options

  const shouldReduceMotion = computed(() => {
    return prefersReducedMotion.value === 'reduce'
  })

  const createAnimationOptions = <T extends AnimationOptions>(
    originalOptions: T
  ): T => {
    if (!shouldReduceMotion.value) {
      return originalOptions
    }

    if (skipAnimation) {
      // Return minimal options - animation will essentially be skipped
      return {
        ...originalOptions,
        duration: 0,
        delay: 0,
      } as T
    }

    if (instantDuration) {
      return {
        ...originalOptions,
        duration: 1, // Minimal duration but still triggers callbacks
        delay: 0,
        easing: 'linear',
      } as T
    }

    if (fadeOnly) {
      // Only allow opacity changes, remove transforms
      const { opacity, ...rest } = originalOptions
      return {
        ...rest,
        opacity,
        duration: Math.min(originalOptions.duration || 300, 200),
        translateX: undefined,
        translateY: undefined,
        scale: undefined,
        rotate: undefined,
      } as T
    }

    return originalOptions
  }

  const wrapAnimation = <T extends AnimationOptions>(
    animateFn: (options: T) => unknown,
    options: T
  ): unknown => {
    const reducedOptions = createAnimationOptions(options)
    return animateFn(reducedOptions)
  }

  const fadeOnlyAnimation = (
    targets: string | Element | Element[] | NodeList | null,
    fromOpacity: number,
    toOpacity: number,
    duration: number = 200
  ) => {
    if (!shouldReduceMotion.value) {
      // Let the original animation handle it
      return null
    }

    return {
      targets,
      opacity: [fromOpacity, toOpacity],
      duration,
      easing: 'linear',
    }
  }

  const disableAnimationStyles = computed(() => {
    if (!shouldReduceMotion.value) {
      return {}
    }

    return {
      animation: 'none !important',
      transition: 'none !important',
    }
  })

  const instantTransitionStyles = computed(() => {
    if (!shouldReduceMotion.value) {
      return {}
    }

    return {
      transitionDuration: '0.01ms !important',
      animationDuration: '0.01ms !important',
    }
  })

  return {
    shouldReduceMotion,
    prefersReducedMotion,
    createAnimationOptions,
    wrapAnimation,
    fadeOnlyAnimation,
    disableAnimationStyles,
    instantTransitionStyles,
  }
}
