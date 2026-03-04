import anime from 'animejs'
import { useEventListener, useThrottleFn } from '@vueuse/core'

export interface SwipeOptions {
  threshold?: number
  direction?: 'horizontal' | 'vertical' | 'both'
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onSwipe?: (direction: string, distance: number) => void
}

export interface PanOptions {
  onPanStart?: (x: number, y: number) => void
  onPan?: (x: number, y: number, deltaX: number, deltaY: number) => void
  onPanEnd?: (x: number, y: number) => void
  inertia?: boolean
}

export interface PinchOptions {
  onPinchStart?: () => void
  onPinch?: (scale: number) => void
  onPinchEnd?: () => void
  minScale?: number
  maxScale?: number
}

export const useGestures = () => {
  const swipe = (
    element: HTMLElement | string,
    options: SwipeOptions = {}
  ): (() => void) => {
    const {
      threshold = 50,
      direction = 'horizontal',
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      onSwipe,
    } = options

    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return () => {}
    }

    let startX = 0
    let startY = 0
    let isSwiping = false

    const onStart = (e: TouchEvent | MouseEvent) => {
      const point = 'touches' in e ? e.touches[0] : e
      startX = point.clientX
      startY = point.clientY
      isSwiping = true
    }

    const onEnd = (e: TouchEvent | MouseEvent) => {
      if (!isSwiping) return
      isSwiping = false

      const point = 'changedTouches' in e ? e.changedTouches[0] : e
      const endX = (point as MouseEvent).clientX
      const endY = (point as MouseEvent).clientY

      const diffX = endX - startX
      const diffY = endY - startY

      if (direction === 'horizontal' || direction === 'both') {
        if (Math.abs(diffX) > threshold) {
          if (diffX > 0) {
            onSwipeRight?.()
            onSwipe?.('right', diffX)
          } else {
            onSwipeLeft?.()
            onSwipe?.('left', Math.abs(diffX))
          }
        }
      }

      if (direction === 'vertical' || direction === 'both') {
        if (Math.abs(diffY) > threshold) {
          if (diffY > 0) {
            onSwipeDown?.()
            onSwipe?.('down', diffY)
          } else {
            onSwipeUp?.()
            onSwipe?.('up', Math.abs(diffY))
          }
        }
      }
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchend', onEnd)
    el.addEventListener('mousedown', onStart)
    el.addEventListener('mouseup', onEnd)

    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchend', onEnd)
      el.removeEventListener('mousedown', onStart)
      el.removeEventListener('mouseup', onEnd)
    }
  }

  const pan = (
    element: HTMLElement | string,
    options: PanOptions = {}
  ): (() => void) => {
    const { onPanStart, onPan, onPanEnd, inertia = true } = options

    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return () => {}
    }

    let startX = 0
    let startY = 0
    let currentX = 0
    let currentY = 0
    let isPanning = false
    let velocityX = 0
    let velocityY = 0
    let lastX = 0
    let lastY = 0
    let lastTime = 0

    const onStart = (e: TouchEvent | MouseEvent) => {
      const point = 'touches' in e ? e.touches[0] : e
      startX = point.clientX
      startY = point.clientY
      lastX = startX
      lastY = startY
      lastTime = Date.now()
      isPanning = true
      onPanStart?.(0, 0)
    }

    const onMove = useThrottleFn((e: TouchEvent | MouseEvent) => {
      if (!isPanning) return

      const point = 'touches' in e ? e.touches[0] : e
      const x = point.clientX
      const y = point.clientY
      const deltaX = x - startX
      const deltaY = y - startY

      currentX = deltaX
      currentY = deltaY

      const now = Date.now()
      const dt = now - lastTime
      if (dt > 0) {
        velocityX = (x - lastX) / dt
        velocityY = (y - lastY) / dt
      }

      lastX = x
      lastY = y
      lastTime = now

      onPan?.(currentX, currentY, deltaX, deltaY)

      anime.set(el, {
        translateX: currentX,
        translateY: currentY,
      })
    }, 16)

    const onEnd = () => {
      if (!isPanning) return
      isPanning = false
      onPanEnd?.(currentX, currentY)

      if (inertia) {
        const decay = 0.95
        let vx = velocityX * 20
        let vy = velocityY * 20

        const animate = () => {
          if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) return

          vx *= decay
          vy *= decay
          currentX += vx
          currentY += vy

          anime.set(el, {
            translateX: currentX,
            translateY: currentY,
          })

          requestAnimationFrame(animate)
        }

        animate()
      }
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: true })
    el.addEventListener('touchend', onEnd)
    el.addEventListener('mousedown', onStart)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseup', onEnd)
    el.addEventListener('mouseleave', onEnd)

    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
      el.removeEventListener('mousedown', onStart)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseup', onEnd)
      el.removeEventListener('mouseleave', onEnd)
    }
  }

  const pinch = (
    element: HTMLElement | string,
    options: PinchOptions = {}
  ): (() => void) => {
    const { onPinchStart, onPinch, onPinchEnd, minScale = 0.5, maxScale = 3 } = options

    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return () => {}
    }

    let initialDistance = 0
    let currentScale = 1
    let isPinching = false

    const getDistance = (touches: TouchList): number => {
      const dx = touches[0].clientX - touches[1].clientX
      const dy = touches[0].clientY - touches[1].clientY
      return Math.sqrt(dx * dx + dy * dy)
    }

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) return
      initialDistance = getDistance(e.touches)
      isPinching = true
      onPinchStart?.()
    }

    const onMove = (e: TouchEvent) => {
      if (!isPinching || e.touches.length !== 2) return
      e.preventDefault()

      const distance = getDistance(e.touches)
      const scale = Math.min(Math.max((distance / initialDistance) * currentScale, minScale), maxScale)

      onPinch?.(scale)

      anime.set(el, { scale })
    }

    const onEnd = () => {
      if (!isPinching) return
      isPinching = false
      const current = anime.get(el, 'scale') as number
      currentScale = typeof current === 'number' ? current : 1
      onPinchEnd?.()
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd)

    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
    }
  }

  const shake = (
    element: HTMLElement | string,
    intensity: number = 10
  ): anime.AnimeInstance => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return anime({ targets: null, duration: 0 })
    }

    return anime({
      targets: el,
      translateX: [
        { value: -intensity, duration: 100 },
        { value: intensity, duration: 100 },
        { value: -intensity, duration: 100 },
        { value: intensity, duration: 100 },
        { value: 0, duration: 100 },
      ],
      easing: 'easeInOutQuad',
    })
  }

  return {
    swipe,
    pan,
    pinch,
    shake,
  }
}
