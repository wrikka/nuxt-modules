import type { ProximityState } from '../types'

// Proximity Sensor - Auto speaker/earpiece switch for voice messages
export const useProximitySensor = () => {
  const config = useRuntimeConfig()
  const isNear = ref(false)
  const isActive = ref(false)
  const audioMode = ref<'speaker' | 'earpiece'>('speaker')
  const sensor = ref<ProximitySensor | null>(null)

  // Check support
  const isSupported = computed(() => {
    return 'ProximitySensor' in window || 'ondeviceproximity' in window
  })

  // Initialize sensor
  const initSensor = async (): Promise<void> => {
    if (!config.public.wchat?.enableProximitySensor) return
    if (!isSupported.value) return

    try {
      // @ts-ignore - ProximitySensor API
      sensor.value = new ProximitySensor({ frequency: 10 })

      sensor.value.addEventListener('reading', () => {
        // @ts-ignore
        const distance = sensor.value.distance
        // @ts-ignore
        const max = sensor.value.max

        isNear.value = distance < max
        updateAudioMode()
      })

      await sensor.value.start()
      isActive.value = true
    } catch {
      // Fallback to generic sensor API
      initFallback()
    }
  }

  // Fallback using deviceorientation or generic events
  const initFallback = (): void => {
    // Some browsers support ondeviceproximity
    window.addEventListener('deviceproximity', (e: any) => {
      isNear.value = e.value < e.max
      updateAudioMode()
    })
  }

  // Update audio mode based on proximity
  const updateAudioMode = (): void => {
    const newMode = isNear.value ? 'earpiece' : 'speaker'
    if (newMode !== audioMode.value) {
      audioMode.value = newMode
      applyAudioMode(newMode)
    }
  }

  // Apply audio mode to element
  const applyAudioMode = (mode: 'speaker' | 'earpiece'): void => {
    const audioElements = document.querySelectorAll('audio[data-proximity="true"]')
    audioElements.forEach((el) => {
      const audio = el as HTMLAudioElement
      if (mode === 'earpiece') {
        audio.volume = 0.3 // Lower volume for earpiece
      } else {
        audio.volume = 1.0 // Full volume for speaker
      }
    })
  }

  // Stop sensor
  const stopSensor = (): void => {
    if (sensor.value) {
      sensor.value.stop()
    }
    isActive.value = false
  }

  // Toggle sensor
  const toggle = (enabled: boolean): void => {
    if (enabled) {
      initSensor()
    } else {
      stopSensor()
    }
  }

  // Manual override
  const setAudioMode = (mode: 'speaker' | 'earpiece'): void => {
    audioMode.value = mode
    applyAudioMode(mode)
  }

  return {
    isNear: readonly(isNear),
    isActive: readonly(isActive),
    audioMode: readonly(audioMode),
    isSupported,
    initSensor,
    stopSensor,
    toggle,
    setAudioMode
  }
}

// Swipe Gestures - Swipe to reply, delete, archive
export const useSwipeGestures = () => {
  const config = useRuntimeConfig()
  const swipeState = ref<{
    startX: number
    startY: number
    currentX: number
    isSwiping: boolean
    direction: 'left' | 'right' | null
    element: HTMLElement | null
  }>({
    startX: 0,
    startY: 0,
    currentX: 0,
    isSwiping: false,
    direction: null,
    element: null
  })

  const SWIPE_THRESHOLD = 80
  const MAX_SWIPE = 150

  // Start swipe
  const onTouchStart = (e: TouchEvent | MouseEvent, element: HTMLElement): void => {
    if (!config.public.wchat?.enableSwipeGestures) return

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    swipeState.value = {
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      isSwiping: true,
      direction: null,
      element
    }
  }

  // Move swipe
  const onTouchMove = (e: TouchEvent | MouseEvent): void => {
    if (!swipeState.value.isSwiping) return

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const deltaX = clientX - swipeState.value.startX
    const deltaY = clientY - swipeState.value.startY

    // Check if horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault()

      const direction = deltaX > 0 ? 'right' : 'left'
      const limitedDelta = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, deltaX))

      swipeState.value.currentX = clientX
      swipeState.value.direction = direction

      // Apply transform
      if (swipeState.value.element) {
        swipeState.value.element.style.transform = `translateX(${limitedDelta}px)`
      }
    }
  }

  // End swipe
  const onTouchEnd = (): {
    action: 'reply' | 'delete' | 'archive' | null
    direction: 'left' | 'right' | null
  } => {
    if (!swipeState.value.isSwiping) {
      return { action: null, direction: null }
    }

    const deltaX = swipeState.value.currentX - swipeState.value.startX
    const direction = swipeState.value.direction

    // Reset transform
    if (swipeState.value.element) {
      swipeState.value.element.style.transform = ''
    }

    // Determine action
    let action: 'reply' | 'delete' | 'archive' | null = null

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (direction === 'right') {
        action = 'reply'
      } else if (direction === 'left') {
        // Left swipe can be delete or archive based on distance
        action = Math.abs(deltaX) > MAX_SWIPE * 0.8 ? 'delete' : 'archive'
      }
    }

    // Reset state
    const result = { action, direction }
    swipeState.value.isSwiping = false
    swipeState.value.element = null

    return result
  }

  // Setup element
  const setupSwipe = (element: HTMLElement): () => void => {
    const handleStart = (e: TouchEvent | MouseEvent) => onTouchStart(e, element)
    const handleMove = (e: TouchEvent | MouseEvent) => onTouchMove(e)
    const handleEnd = () => onTouchEnd()

    element.addEventListener('touchstart', handleStart, { passive: true })
    element.addEventListener('touchmove', handleMove, { passive: false })
    element.addEventListener('touchend', handleEnd)

    // Mouse support
    element.addEventListener('mousedown', handleStart)
    element.addEventListener('mousemove', handleMove)
    element.addEventListener('mouseup', handleEnd)
    element.addEventListener('mouseleave', handleEnd)

    // Cleanup
    return () => {
      element.removeEventListener('touchstart', handleStart)
      element.removeEventListener('touchmove', handleMove)
      element.removeEventListener('touchend', handleEnd)
      element.removeEventListener('mousedown', handleStart)
      element.removeEventListener('mousemove', handleMove)
      element.removeEventListener('mouseup', handleEnd)
      element.removeEventListener('mouseleave', handleEnd)
    }
  }

  return {
    swipeState: readonly(swipeState),
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    setupSwipe
  }
}

// Chat Widgets - Embed chat in external websites
export const useChatWidgets = () => {
  const config = useRuntimeConfig()
  const isOpen = ref(false)
  const isMinimized = ref(false)
  const position = ref<'bottom-right' | 'bottom-left'>('bottom-right')

  // Generate widget embed code
  const generateEmbedCode = (widgetId: string): string => {
    return `
<!-- WChat Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${config.public.wchat?.apiEndpoint}/widget.js?id=${widgetId}';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>
    `.trim()
  }

  // Open widget
  const open = (): void => {
    isOpen.value = true
    isMinimized.value = false
  }

  // Close widget
  const close = (): void => {
    isOpen.value = false
  }

  // Minimize widget
  const minimize = (): void => {
    isMinimized.value = true
  }

  // Toggle widget
  const toggle = (): void => {
    if (isOpen.value) {
      if (isMinimized.value) {
        isMinimized.value = false
      } else {
        close()
      }
    } else {
      open()
    }
  }

  return {
    isOpen: readonly(isOpen),
    isMinimized: readonly(isMinimized),
    position: readonly(position),
    generateEmbedCode,
    open,
    close,
    minimize,
    toggle
  }
}
