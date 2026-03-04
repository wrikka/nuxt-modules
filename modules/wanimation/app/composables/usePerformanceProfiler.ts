import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface PerformanceMetrics {
  fps: number
  frameTime: number
  droppedFrames: number
  cpuTime: number
  memoryUsage: number | null
  animationCount: number
}

export interface ProfilerOptions {
  sampleSize?: number
  warningThreshold?: number
  onWarning?: (metrics: PerformanceMetrics) => void
}

export const usePerformanceProfiler = (options: ProfilerOptions = {}) => {
  const { sampleSize = 60, warningThreshold = 30, onWarning } = options

  const metrics = ref<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    droppedFrames: 0,
    cpuTime: 0,
    memoryUsage: null,
    animationCount: 0,
  })

  const isRunning = ref(false)
  const frameTimes: number[] = []
  let lastTime = performance.now()
  let rafId: number | null = null
  let animationCount = 0

  // Track active animations
  const trackAnimation = () => {
    animationCount++
    metrics.value.animationCount = animationCount
    return () => {
      animationCount--
      metrics.value.animationCount = animationCount
    }
  }

  const measureFrame = () => {
    const now = performance.now()
    const frameTime = now - lastTime
    lastTime = now

    frameTimes.push(frameTime)
    if (frameTimes.length > sampleSize) {
      frameTimes.shift()
    }

    // Calculate average FPS
    const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
    const fps = 1000 / avgFrameTime
    const droppedFrames = frameTimes.filter(t => t > 33).length

    metrics.value = {
      fps: Math.round(fps),
      frameTime: Math.round(avgFrameTime * 100) / 100,
      droppedFrames,
      cpuTime: 0, // Would need more sophisticated measurement
      memoryUsage: (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || null,
      animationCount,
    }

    // Check warning threshold
    if (fps < warningThreshold && onWarning) {
      onWarning(metrics.value)
    }

    rafId = requestAnimationFrame(measureFrame)
  }

  const start = () => {
    if (isRunning.value) return
    isRunning.value = true
    lastTime = performance.now()
    frameTimes.length = 0
    rafId = requestAnimationFrame(measureFrame)
  }

  const stop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    isRunning.value = false
  }

  // Auto-start when component mounts
  onMounted(() => {
    start()
  })

  onUnmounted(() => {
    stop()
  })

  const fpsHistory = computed(() => [...frameTimes])

  const performanceGrade = computed(() => {
    const fps = metrics.value.fps
    if (fps >= 55) return 'excellent'
    if (fps >= 45) return 'good'
    if (fps >= 30) return 'fair'
    return 'poor'
  })

  return {
    metrics,
    isRunning,
    fpsHistory,
    performanceGrade,
    start,
    stop,
    trackAnimation,
  }
}
