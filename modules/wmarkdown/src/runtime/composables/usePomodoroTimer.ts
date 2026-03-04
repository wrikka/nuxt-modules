import { ref, computed, onUnmounted } from 'vue'

type TimerState = 'idle' | 'running' | 'paused' | 'break'

interface PomodoroSettings {
  workDuration: number // minutes
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
}

interface PomodoroStats {
  completedPomodoros: number
  totalWorkTime: number // minutes
  completedBreaks: number
}

export function usePomodoroTimer(settings: Partial<PomodoroSettings> = {}) {
  const config = ref<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    ...settings
  })

  const state = ref<TimerState>('idle')
  const timeLeft = ref(0)
  const completedPomodoros = ref(0)
  const completedBreaks = ref(0)
  const totalWorkTime = ref(0)
  let timerInterval: NodeJS.Timeout | null = null

  const isRunning = computed(() => state.value === 'running')
  const isBreak = computed(() => state.value === 'break')
  const isWork = computed(() => state.value === 'running' && !isBreak.value)

  const progress = computed(() => {
    let total = 0
    if (isBreak.value) {
      const isLongBreak = (completedPomodoros.value % config.value.longBreakInterval) === 0 && completedPomodoros.value > 0
      total = isLongBreak ? config.value.longBreakDuration : config.value.shortBreakDuration
    } else {
      total = config.value.workDuration
    }
    return total > 0 ? ((total * 60 - timeLeft.value) / (total * 60)) * 100 : 0
  })

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60)
    const seconds = timeLeft.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const currentMode = computed(() => {
    if (isBreak.value) {
      const isLongBreak = (completedPomodoros.value % config.value.longBreakInterval) === 0 && completedPomodoros.value > 0
      return isLongBreak ? 'Long Break' : 'Short Break'
    }
    return 'Focus'
  })

  const start = () => {
    if (state.value === 'idle' || state.value === 'paused') {
      if (state.value === 'idle') {
        timeLeft.value = config.value.workDuration * 60
      }
      state.value = 'running'
      runTimer()
    }
  }

  const pause = () => {
    if (state.value === 'running') {
      state.value = 'paused'
      if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
      }
    }
  }

  const resume = () => {
    if (state.value === 'paused') {
      state.value = 'running'
      runTimer()
    }
  }

  const stop = () => {
    state.value = 'idle'
    timeLeft.value = 0
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  const skip = () => {
    completeCurrentSession()
  }

  const reset = () => {
    stop()
    completedPomodoros.value = 0
    completedBreaks.value = 0
    totalWorkTime.value = 0
  }

  const runTimer = () => {
    if (timerInterval) return

    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
        if (!isBreak.value) {
          totalWorkTime.value++
        }
      } else {
        completeCurrentSession()
      }
    }, 1000)
  }

  const completeCurrentSession = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }

    if (isBreak.value) {
      completedBreaks.value++
      if (config.value.autoStartPomodoros) {
        startWork()
      } else {
        state.value = 'idle'
      }
    } else {
      completedPomodoros.value++
      if (config.value.autoStartBreaks) {
        startBreak()
      } else {
        state.value = 'idle'
      }
    }
  }

  const startWork = () => {
    state.value = 'running'
    timeLeft.value = config.value.workDuration * 60
    runTimer()
  }

  const startBreak = () => {
    state.value = 'break'
    const isLongBreak = (completedPomodoros.value % config.value.longBreakInterval) === 0 && completedPomodoros.value > 0
    timeLeft.value = (isLongBreak ? config.value.longBreakDuration : config.value.shortBreakDuration) * 60
    runTimer()
  }

  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    Object.assign(config.value, newSettings)
  }

  const getStats = (): PomodoroStats => ({
    completedPomodoros: completedPomodoros.value,
    totalWorkTime: Math.floor(totalWorkTime.value / 60),
    completedBreaks: completedBreaks.value
  })

  onUnmounted(() => {
    if (timerInterval) {
      clearInterval(timerInterval)
    }
  })

  return {
    state,
    timeLeft,
    formattedTime,
    progress,
    currentMode,
    isRunning,
    isBreak,
    isWork,
    completedPomodoros,
    completedBreaks,
    config,
    start,
    pause,
    resume,
    stop,
    skip,
    reset,
    startWork,
    startBreak,
    updateSettings,
    getStats
  }
}
