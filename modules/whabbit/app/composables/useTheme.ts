import { computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'

export type Theme = 'light' | 'dark'

export const useTheme = () => {
  const theme = useStorage<Theme>('theme', 'light')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  const isDark = computed(() => theme.value === 'dark')

  watch(theme, (newTheme: Theme) => {
    if (import.meta.client) {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, { immediate: true })

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark
  }
}
