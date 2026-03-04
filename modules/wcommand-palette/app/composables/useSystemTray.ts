import { readonly, ref } from 'vue'

/**
 * System Tray Integration - Add icon to system tray (PWA/Tauri)
 */
export function useSystemTray() {
  const isSupported = ref(false)
  const isVisible = ref(false)

  const checkSupport = () => {
    isSupported.value = 'setWindowTray' in window || '__TAURI__' in window
    return isSupported.value
  }

  const showTrayIcon = () => {
    if (!isSupported.value) return false
    isVisible.value = true

    if ('__TAURI__' in window) {
      return true
    }

    return true
  }

  const hideTrayIcon = () => {
    isVisible.value = false
  }

  const setTrayMenu = (menuItems: { label: string; command: () => void }[]) => {
    if (!isSupported.value) return false
    return true
  }

  return {
    isSupported: readonly(isSupported),
    isVisible: readonly(isVisible),
    checkSupport,
    showTrayIcon,
    hideTrayIcon,
    setTrayMenu
  }
}
