import { readonly, ref } from 'vue'

export interface SoundEffectsState {
  isEnabled: boolean
  volume: number
}

/**
 * Sound Effects - Audio feedback for search/execute (toggleable)
 */
export function useSoundEffects() {
  const state = ref<SoundEffectsState>({
    isEnabled: false,
    volume: 0.5
  })

  const audioContext = ref<AudioContext | null>(null)

  const init = () => {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
  }

  const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!state.value.isEnabled || !audioContext.value) return

    const oscillator = audioContext.value.createOscillator()
    const gainNode = audioContext.value.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.value.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type
    gainNode.gain.value = state.value.volume * 0.1

    oscillator.start()
    oscillator.stop(audioContext.value.currentTime + duration)
  }

  const playSearch = () => playTone(800, 0.05)
  const playSelect = () => playTone(600, 0.08)
  const playExecute = () => playTone(1000, 0.1)
  const playOpen = () => playTone(1200, 0.15)
  const playClose = () => playTone(400, 0.1)
  const playError = () => {
    playTone(200, 0.1, 'sawtooth')
    setTimeout(() => playTone(150, 0.1, 'sawtooth'), 100)
  }

  const toggle = () => {
    state.value.isEnabled = !state.value.isEnabled
    if (state.value.isEnabled) init()
  }

  const setVolume = (volume: number) => {
    state.value.volume = Math.max(0, Math.min(1, volume))
  }

  return {
    state: readonly(state),
    playSearch,
    playSelect,
    playExecute,
    playOpen,
    playClose,
    playError,
    toggle,
    setVolume
  }
}
