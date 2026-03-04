import { readonly, ref } from 'vue'

export interface ProgressState {
  isLoading: boolean
  progress: number
  message: string
}

/**
 * Loading Progress Bar - Show progress during initial load
 */
export function useLoadingProgress() {
  const state = ref<ProgressState>({
    isLoading: false,
    progress: 0,
    message: ''
  })

  const start = (message = 'Loading...') => {
    state.value = { isLoading: true, progress: 0, message }
  }

  const update = (progress: number, message?: string) => {
    state.value.progress = Math.max(0, Math.min(100, progress))
    if (message) state.value.message = message
  }

  const increment = (amount: number) => {
    update(state.value.progress + amount)
  }

  const complete = () => {
    state.value.progress = 100
    setTimeout(() => {
      state.value.isLoading = false
      state.value.progress = 0
      state.value.message = ''
    }, 300)
  }

  const setMessage = (message: string) => {
    state.value.message = message
  }

  return {
    state: readonly(state),
    start,
    update,
    increment,
    complete,
    setMessage
  }
}
