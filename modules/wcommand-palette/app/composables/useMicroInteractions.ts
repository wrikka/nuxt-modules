import { readonly, ref } from 'vue'

export interface MicroInteraction {
  type: 'hover' | 'select' | 'execute' | 'open' | 'close'
  duration: number
  easing: string
}

/**
 * Micro-interactions - Small animations for hover/select/execute
 */
export function useMicroInteractions() {
  const isEnabled = ref(true)
  const currentAnimation = ref<MicroInteraction | null>(null)

  const interactions: Record<string, MicroInteraction> = {
    hover: { type: 'hover', duration: 150, easing: 'ease-out' },
    select: { type: 'select', duration: 100, easing: 'ease-in-out' },
    execute: { type: 'execute', duration: 200, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    open: { type: 'open', duration: 250, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    close: { type: 'close', duration: 200, easing: 'ease-in' }
  }

  const play = (type: keyof typeof interactions) => {
    if (!isEnabled.value) return
    currentAnimation.value = interactions[type]
  }

  const stop = () => {
    currentAnimation.value = null
  }

  const toggle = () => {
    isEnabled.value = !isEnabled.value
  }

  const getStyles = (type: keyof typeof interactions): string => {
    const interaction = interactions[type]
    return `transition: all ${interaction.duration}ms ${interaction.easing}`
  }

  return {
    isEnabled: readonly(isEnabled),
    currentAnimation: readonly(currentAnimation),
    play,
    stop,
    toggle,
    getStyles,
    interactions
  }
}
