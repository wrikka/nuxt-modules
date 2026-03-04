import { readonly, ref } from 'vue'

/**
 * Blur Backdrop - Add blur effect to background when palette is open
 */
export function useBlurBackdrop() {
  const isEnabled = ref(true)
  const blurAmount = ref(8)

  const enable = () => {
    isEnabled.value = true
    document.body.style.overflow = 'hidden'
  }

  const disable = () => {
    isEnabled.value = false
    document.body.style.overflow = ''
  }

  const toggle = () => {
    if (isEnabled.value) {
      disable()
    }
    else {
      enable()
    }
  }

  const setBlur = (amount: number) => {
    blurAmount.value = Math.max(0, Math.min(20, amount))
  }

  const getBackdropStyle = () => {
    if (!isEnabled.value) return {}
    return {
      backdropFilter: `blur(${blurAmount.value}px)`,
      WebkitBackdropFilter: `blur(${blurAmount.value}px)`,
      backgroundColor: 'rgba(0, 0, 0, 0.3)'
    }
  }

  return {
    isEnabled: readonly(isEnabled),
    blurAmount: readonly(blurAmount),
    enable,
    disable,
    toggle,
    setBlur,
    getBackdropStyle
  }
}
