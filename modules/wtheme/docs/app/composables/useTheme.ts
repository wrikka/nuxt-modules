// WTheme composables
export function useTheme() {
  const isDark = useState('wtheme-dark', () => false)

  const toggleDark = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  const setDark = (value: boolean) => {
    isDark.value = value
    document.documentElement.classList.toggle('dark', value)
  }

  return {
    isDark,
    toggleDark,
    setDark,
  }
}
