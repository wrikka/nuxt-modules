export interface ResponsiveAnimationOptions {
  mobile?: AnimationVariant
  tablet?: AnimationVariant
  desktop?: AnimationVariant
  breakpoints?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
}

interface AnimationVariant {
  duration?: number
  delay?: number
  easing?: string
  distance?: number
  scale?: number
  rotate?: number
  stagger?: number
}

export const useResponsiveAnimations = () => {
  const getCurrentBreakpoint = (breakpoints: { mobile?: number; tablet?: number; desktop?: number }) => {
    const width = window.innerWidth
    if (width < (breakpoints.mobile || 640)) return 'mobile'
    if (width < (breakpoints.tablet || 1024)) return 'tablet'
    return 'desktop'
  }

  const createVariants = (
    options: ResponsiveAnimationOptions
  ): AnimationVariant => {
    const { mobile, tablet, desktop, breakpoints = {} } = options

    const current = getCurrentBreakpoint(breakpoints)

    // Merge with defaults
    const defaults: AnimationVariant = {
      duration: 600,
      delay: 0,
      easing: 'easeOutQuad',
      distance: 50,
      scale: 1,
      rotate: 0,
      stagger: 50,
    }

    const variant = current === 'mobile' ? mobile : current === 'tablet' ? tablet : desktop

    return { ...defaults, ...variant }
  }

  const observeBreakpoint = (
    options: ResponsiveAnimationOptions,
    callback: (variant: AnimationVariant, breakpoint: string) => void
  ): (() => void) => {
    const { breakpoints = {} } = options

    let currentBreakpoint = getCurrentBreakpoint(breakpoints)

    const handleResize = () => {
      const newBreakpoint = getCurrentBreakpoint(breakpoints)
      if (newBreakpoint !== currentBreakpoint) {
        currentBreakpoint = newBreakpoint
        const variant = createVariants(options)
        callback(variant, newBreakpoint)
      }
    }

    window.addEventListener('resize', handleResize, { passive: true })

    // Initial call
    const initialVariant = createVariants(options)
    callback(initialVariant, currentBreakpoint)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }

  return {
    createVariants,
    observeBreakpoint,
    getCurrentBreakpoint,
  }
}
