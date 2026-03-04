import type { Ref } from 'vue'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Ref<Theme>
  isDark: Ref<boolean>
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme(): ThemeState {
  const theme = useState<Theme>('wdashboard-theme', () => 'system')
  const isDark = useState<boolean>('wdashboard-is-dark', () => false)

  const updateTheme = (): void => {
    const resolvedTheme = theme.value === 'system' ? getSystemTheme() : theme.value
    isDark.value = resolvedTheme === 'dark'

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark.value)
    }
  }

  const setTheme = (newTheme: Theme): void => {
    theme.value = newTheme
    updateTheme()
  }

  const toggleTheme = (): void => {
    const themes: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme.value)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
  }

  onMounted(() => {
    updateTheme()

    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (theme.value === 'system') {
          updateTheme()
        }
      })
    }
  })

  watch(theme, updateTheme)

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme
  }
}
