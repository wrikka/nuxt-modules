import { onMounted, onUnmounted, readonly, ref } from 'vue'

export interface GestureState {
  isSwiping: boolean
  direction: 'left' | 'right' | 'up' | 'down' | null
  distance: number
}

/**
 * Gesture Support - Handle swipe gestures on mobile
 */
export function useGestureSupport() {
  const state = ref<GestureState>({
    isSwiping: false,
    direction: null,
    distance: 0
  })

  const startX = ref(0)
  const startY = ref(0)
  const threshold = 50

  const onTouchStart = (event: TouchEvent) => {
    startX.value = event.touches[0].clientX
    startY.value = event.touches[0].clientY
    state.value.isSwiping = true
  }

  const onTouchMove = (event: TouchEvent) => {
    if (!state.value.isSwiping) return

    const deltaX = event.touches[0].clientX - startX.value
    const deltaY = event.touches[0].clientY - startY.value

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      state.value.direction = deltaX > 0 ? 'right' : 'left'
      state.value.distance = Math.abs(deltaX)
    }
    else {
      state.value.direction = deltaY > 0 ? 'down' : 'up'
      state.value.distance = Math.abs(deltaY)
    }
  }

  const onTouchEnd = () => {
    state.value.isSwiping = false
    state.value.direction = null
    state.value.distance = 0
  }

  const isSwipe = (): boolean => {
    return state.value.distance > threshold
  }

  const getSwipeDirection = (): GestureState['direction'] => {
    return isSwipe() ? state.value.direction : null
  }

  const bind = (element: HTMLElement) => {
    element.addEventListener('touchstart', onTouchStart)
    element.addEventListener('touchmove', onTouchMove)
    element.addEventListener('touchend', onTouchEnd)
  }

  const unbind = (element: HTMLElement) => {
    element.removeEventListener('touchstart', onTouchStart)
    element.removeEventListener('touchmove', onTouchMove)
    element.removeEventListener('touchend', onTouchEnd)
  }

  return {
    state: readonly(state),
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwipe,
    getSwipeDirection,
    bind,
    unbind
  }
}
