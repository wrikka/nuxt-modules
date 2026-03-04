import { readonly, ref } from 'vue'

/**
 * Haptic Feedback - Vibrate on execute on mobile
 */
export function useHapticFeedback() {
  const isEnabled = ref(true)
  const isSupported = ref(false)

  const checkSupport = () => {
    isSupported.value = 'vibrate' in navigator
    return isSupported.value
  }

  const trigger = (pattern: number | number[] = 50) => {
    if (!isEnabled.value || !isSupported.value) return false

    try {
      navigator.vibrate(pattern)
      return true
    }
    catch {
      return false
    }
  }

  const light = () => trigger(10)
  const medium = () => trigger(20)
  const heavy = () => trigger(50)
  const success = () => trigger([10, 50, 10])
  const error = () => trigger([30, 30, 30])

  const toggle = () => {
    isEnabled.value = !isEnabled.value
  }

  return {
    isEnabled: readonly(isEnabled),
    isSupported: readonly(isSupported),
    checkSupport,
    trigger,
    light,
    medium,
    heavy,
    success,
    error,
    toggle
  }
}
