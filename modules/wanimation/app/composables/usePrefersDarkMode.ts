import { usePreferredDark } from '@vueuse/core'

export interface DarkModeAnimationOptions {
  duration?: number
  easing?: string
  properties?: Array<'background' | 'color' | 'border' | 'shadow'>
}

export const usePrefersDarkMode = () => {
  const isDark = usePreferredDark()

  const applyDarkMode = (
    element: HTMLElement | string,
    options: DarkModeAnimationOptions = {}
  ): (() => void) => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) return () => {}

    const { duration = 300 } = options

    const updateTheme = () => {
      if (isDark.value) {
        el.style.transition = `all ${duration}ms ease`
        el.classList.add('dark-mode')
      } else {
        el.style.transition = `all ${duration}ms ease`
        el.classList.remove('dark-mode')
      }
    }

    // Initial apply
    updateTheme()

    // Watch for changes
    const unwatch = watch(isDark, updateTheme)

    return () => {
      unwatch()
    }
  }

  const createThemeToggle = (
    lightClass: string = 'light',
    darkClass: string = 'dark'
  ): { toggle: () => void; isDark: typeof isDark } => {
    const toggle = () => {
      const html = document.documentElement
      if (html.classList.contains(darkClass)) {
        html.classList.remove(darkClass)
        html.classList.add(lightClass)
      } else {
        html.classList.remove(lightClass)
        html.classList.add(darkClass)
      }
    }

    return {
      toggle,
      isDark,
    }
  }

  return {
    isDark,
    applyDarkMode,
    createThemeToggle,
  }
}
