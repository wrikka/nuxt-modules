/**
 * Voice input composable for AI Chat Input
 */

export interface VoiceRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

export interface VoiceInputState {
  isSupported: boolean
  isListening: boolean
  isProcessing: boolean
  transcript: string
  interimTranscript: string
  error: string | null
}

export interface VoiceInputOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  maxAlternatives?: number
  onResult?: (result: VoiceRecognitionResult) => void
  onError?: (error: string) => void
  onStart?: () => void
  onEnd?: () => void
}

export function useVoiceInput(options: VoiceInputOptions = {}) {
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true,
    maxAlternatives = 1,
    onResult,
    onError,
    onStart,
    onEnd
  } = options

  const state = ref<VoiceInputState>({
    isSupported: false,
    isListening: false,
    isProcessing: false,
    transcript: '',
    interimTranscript: '',
    error: null
  })

  let recognition: SpeechRecognition | null = null

  // Check browser support
  onMounted(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        state.value.isSupported = true
        recognition = new SpeechRecognition()
        
        // Configure recognition
        recognition.lang = language
        recognition.continuous = continuous
        recognition.interimResults = interimResults
        recognition.maxAlternatives = maxAlternatives

        // Event handlers
        recognition.onstart = () => {
          state.value.isListening = true
          state.value.error = null
          onStart?.()
        }

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            const transcript = result[0].transcript

            if (result.isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          state.value.interimTranscript = interimTranscript
          
          if (finalTranscript) {
            state.value.transcript += finalTranscript
            
            const voiceResult: VoiceRecognitionResult = {
              transcript: finalTranscript,
              confidence: event.results[event.results.length - 1][0].confidence,
              isFinal: true
            }
            
            onResult?.(voiceResult)
          }
        }

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          let errorMessage = 'Voice recognition error'
          
          switch (event.error) {
            case 'no-speech':
              errorMessage = 'No speech detected'
              break
            case 'audio-capture':
              errorMessage = 'Microphone not available'
              break
            case 'not-allowed':
              errorMessage = 'Microphone permission denied'
              break
            case 'network':
              errorMessage = 'Network error'
              break
            case 'service-not-allowed':
              errorMessage = 'Voice recognition service not allowed'
              break
            default:
              errorMessage = `Voice recognition error: ${event.error}`
          }

          state.value.error = errorMessage
          state.value.isListening = false
          onError?.(errorMessage)
        }

        recognition.onend = () => {
          state.value.isListening = false
          state.value.interimTranscript = ''
          onEnd?.()
        }
      }
    }
  })

  const startListening = () => {
    if (!state.value.isSupported || !recognition) {
      state.value.error = 'Voice recognition not supported'
      return
    }

    if (state.value.isListening) {
      return
    }

    try {
      recognition.start()
    } catch (error) {
      state.value.error = 'Failed to start voice recognition'
      console.error('Voice recognition start error:', error)
    }
  }

  const stopListening = () => {
    if (recognition && state.value.isListening) {
      recognition.stop()
    }
  }

  const abortListening = () => {
    if (recognition && state.value.isListening) {
      recognition.abort()
    }
  }

  const clearTranscript = () => {
    state.value.transcript = ''
    state.value.interimTranscript = ''
    state.value.error = null
  }

  const getFullTranscript = computed(() => {
    return state.value.transcript + state.value.interimTranscript
  })

  // Cleanup on unmount
  onUnmounted(() => {
    if (recognition) {
      recognition.abort()
    }
  })

  return {
    state: readonly(state),
    isSupported: computed(() => state.value.isSupported),
    isListening: computed(() => state.value.isListening),
    isProcessing: computed(() => state.value.isProcessing),
    transcript: computed(() => state.value.transcript),
    interimTranscript: computed(() => state.value.interimTranscript),
    fullTranscript: getFullTranscript,
    error: computed(() => state.value.error),
    startListening,
    stopListening,
    abortListening,
    clearTranscript
  }
}

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
  
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
    resultIndex: number
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    error: string
    message?: string
  }
  
  interface SpeechRecognitionResultList {
    length: number
    item(index: number): SpeechRecognitionResult
    [index: number]: SpeechRecognitionResult
  }
  
  interface SpeechRecognitionResult {
    isFinal: boolean
    length: number
    item(index: number): SpeechRecognitionAlternative
    [index: number]: SpeechRecognitionAlternative
  }
  
  interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    maxAlternatives: number
    
    start(): void
    stop(): void
    abort(): void
    
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
    onend: ((this: SpeechRecognition, ev: Event) => any) | null
  }
}
