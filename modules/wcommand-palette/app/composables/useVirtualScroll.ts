import { readonly, ref } from 'vue'

export interface VirtualScrollState {
  startIndex: number
  endIndex: number
  visibleCount: number
  itemHeight: number
  scrollTop: number
}

/**
 * Virtual Scrolling - Render only visible items for long lists
 */
export function useVirtualScroll(itemHeight = 48, overscan = 5) {
  const state = ref<VirtualScrollState>({
    startIndex: 0,
    endIndex: 0,
    visibleCount: 0,
    itemHeight,
    scrollTop: 0
  })

  const containerHeight = ref(0)

  const calculateVisibleRange = (scrollTop: number, totalItems: number) => {
    const { itemHeight } = state.value
    const visibleCount = Math.ceil(containerHeight.value / itemHeight) + overscan * 2

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(totalItems, startIndex + visibleCount)

    state.value = {
      ...state.value,
      startIndex,
      endIndex,
      visibleCount,
      scrollTop
    }
  }

  const getVisibleItems = <T>(items: T[]): T[] => {
    return items.slice(state.value.startIndex, state.value.endIndex)
  }

  const getTotalHeight = (totalItems: number): number => {
    return totalItems * state.value.itemHeight
  }

  const getOffsetY = (): number => {
    return state.value.startIndex * state.value.itemHeight
  }

  const setContainerHeight = (height: number) => {
    containerHeight.value = height
  }

  return {
    state: readonly(state),
    containerHeight: readonly(containerHeight),
    calculateVisibleRange,
    getVisibleItems,
    getTotalHeight,
    getOffsetY,
    setContainerHeight
  }
}
