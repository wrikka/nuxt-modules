import { ref, computed, onUnmounted } from 'vue'

interface VoiceDictationState {
  isListening: boolean
  transcript: string
  interimTranscript: string
  confidence: number
  error: string | null
}

interface VoiceDictationOptions {
  continuous?: boolean
  interimResults?: boolean
  language?: string
  onResult?: (text: string) => void
  onError?: (error: string) => void
}

export function useVoiceDictation(options: VoiceDictationOptions = {}) {
  const state = ref<VoiceDictationState>({
    isListening: false,
    transcript: '',
    interimTranscript: '',
    confidence: 0,
    error: null
  })

  let recognition: SpeechRecognition | null = null
  const isSupported = ref('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)

  const finalTranscript = computed(() => state.value.transcript)
  const hasResult = computed(() => state.value.transcript.length > 0)

  const initRecognition = () => {
    if (!isSupported.value) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognition()

    recognition.continuous = options.continuous ?? true
    recognition.interimResults = options.interimResults ?? true
    recognition.lang = options.language || 'en-US'

    recognition.onstart = () => {
      state.value.isListening = true
      state.value.error = null
    }

    recognition.onend = () => {
      state.value.isListening = false
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
          state.value.confidence = event.results[i][0].confidence
        } else {
          interim += transcript
        }
      }

      if (final) {
        state.value.transcript += final + ' '
        options.onResult?.(state.value.transcript)
      }

      state.value.interimTranscript = interim
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      state.value.error = event.error
      options.onError?.(event.error)
    }
  }

  const start = () => {
    if (!recognition) initRecognition()
    if (!recognition) {
      state.value.error = 'Speech recognition not supported'
      return
    }

    state.value.transcript = ''
    state.value.interimTranscript = ''
    recognition.start()
  }

  const stop = () => {
    recognition?.stop()
    state.value.isListening = false
  }

  const toggle = () => {
    if (state.value.isListening) {
      stop()
    } else {
      start()
    }
  }

  const clear = () => {
    state.value.transcript = ''
    state.value.interimTranscript = ''
    state.value.confidence = 0
  }

  const insertAtCursor = (insertText: string, getText: () => string, setText: (text: string) => void, getCursorPos: () => number) => {
    const text = getText()
    const pos = getCursorPos()
    const before = text.slice(0, pos)
    const after = text.slice(pos)

    const newText = before + insertText + after
    setText(newText)

    return pos + insertText.length
  }

  const getVoiceCommands = (): string[] => {
    return [
      'period',
      'comma',
      'question mark',
      'exclamation point',
      'new line',
      'new paragraph',
      'delete',
      'undo',
      'stop listening'
    ]
  }

  onUnmounted(() => {
    stop()
    recognition = null
  })

  return {
    state,
    isSupported,
    finalTranscript,
    hasResult,
    start,
    stop,
    toggle,
    clear,
    insertAtCursor,
    getVoiceCommands
  }
}

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}
