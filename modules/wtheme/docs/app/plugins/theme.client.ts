// WTheme plugin
export default defineNuxtPlugin(() => {
  // Initialize theme based on system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (prefersDark) {
    document.documentElement.classList.add('dark')
  }
})
