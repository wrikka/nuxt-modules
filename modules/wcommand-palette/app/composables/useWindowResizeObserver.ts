import { onMounted, onUnmounted, readonly, ref } from 'vue'

export interface WindowSize {
  width: number
  height: number
}

/**
 * Window Resize Observer - Auto adjust size when viewport changes
 */
export function useWindowResizeObserver() {
  const windowSize = ref<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const isMobile = ref(window.innerWidth < 768)
  const isTablet = ref(window.innerWidth >= 768 && window.innerWidth < 1024)
  const isDesktop = ref(window.innerWidth >= 1024)

  const updateSize = () => {
    windowSize.value = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    isMobile.value = window.innerWidth < 768
    isTablet.value = window.innerWidth >= 768 && window.innerWidth < 1024
    isDesktop.value = window.innerWidth >= 1024
  }

  const getPaletteMaxHeight = (): number => {
    const maxHeights = { mobile: 400, tablet: 500, desktop: 600 }
    if (isMobile.value) return maxHeights.mobile
    if (isTablet.value) return maxHeights.tablet
    return maxHeights.desktop
  }

  const getPaletteWidth = (): number => {
    const widths = { mobile: window.innerWidth - 32, tablet: 480, desktop: 560 }
    if (isMobile.value) return widths.mobile
    if (isTablet.value) return widths.tablet
    return widths.desktop
  }

  onMounted(() => {
    window.addEventListener('resize', updateSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize)
  })

  return {
    windowSize: readonly(windowSize),
    isMobile: readonly(isMobile),
    isTablet: readonly(isTablet),
    isDesktop: readonly(isDesktop),
    getPaletteMaxHeight,
    getPaletteWidth,
    updateSize
  }
}
