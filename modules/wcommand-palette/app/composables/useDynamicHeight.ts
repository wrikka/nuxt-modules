import { readonly, ref } from 'vue'

export interface DynamicHeightState {
  minHeight: number
  maxHeight: number
  currentHeight: number
  itemCount: number
}

/**
 * Dynamic Height - Adjust palette height based on result count
 */
export function useDynamicHeight(minHeight = 200, maxHeight = 600, itemHeight = 48) {
  const state = ref<DynamicHeightState>({
    minHeight,
    maxHeight,
    currentHeight: minHeight,
    itemCount: 0
  })

  const calculateHeight = (itemCount: number, headerHeight = 56, footerHeight = 0) => {
    const contentHeight = itemCount * itemHeight + headerHeight + footerHeight
    const newHeight = Math.max(minHeight, Math.min(maxHeight, contentHeight))

    state.value = {
      ...state.value,
      currentHeight: newHeight,
      itemCount
    }

    return newHeight
  }

  const getHeight = (): number => {
    return state.value.currentHeight
  }

  const setBounds = (min: number, max: number) => {
    state.value.minHeight = min
    state.value.maxHeight = max
  }

  return {
    state: readonly(state),
    calculateHeight,
    getHeight,
    setBounds
  }
}
