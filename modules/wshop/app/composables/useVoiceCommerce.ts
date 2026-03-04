import { ref, computed, onMounted, onUnmounted } from "vue"

export interface VoiceCommand {
  type: "search" | "add_to_cart" | "checkout" | "navigate" | "filter"
  value: string
  confidence: number
}

export interface VoiceSession {
  id: string
  startedAt: Date
  endedAt?: Date
  commands: VoiceCommand[]
  successfulOrders: number
}

export const useVoiceCommerce = () => {
  const isListening = ref(false)
  const isSupported = ref(false)
  const transcript = ref("")
  const confidence = ref(0)
  const error = ref<Error | null>(null)
  const session = ref<VoiceSession | null>(null)
  let recognition: SpeechRecognition | null = null

  const checkSupport = (): boolean => {
    if (typeof window === "undefined") return false

    const SpeechRecognitionAPI = window.SpeechRecognition || (window as typeof window & { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition
    isSupported.value = !!SpeechRecognitionAPI
    return isSupported.value
  }

  const startListening = async (): Promise<void> => {
    if (!isSupported.value) {
      throw new Error("Speech recognition not supported")
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || (window as typeof window & { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition
    recognition = new SpeechRecognitionAPI()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = navigator.language || "en-US"

    recognition.onstart = () => {
      isListening.value = true
      error.value = null

      session.value = {
        id: crypto.randomUUID(),
        startedAt: new Date(),
        commands: [],
        successfulOrders: 0,
      }
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results.length - 1
      const result = event.results[last]
      transcript.value = result[0].transcript
      confidence.value = result[0].confidence

      if (result.isFinal) {
        processCommand(result[0].transcript)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      error.value = new Error(event.error)
      isListening.value = false
    }

    recognition.onend = () => {
      isListening.value = false
    }

    recognition.start()
  }

  const stopListening = (): void => {
    recognition?.stop()
    isListening.value = false

    if (session.value) {
      session.value.endedAt = new Date()
      // Save session
      $fetch("/api/shop/voice/sessions", {
        method: "POST",
        body: session.value,
      }).catch(() => {})
    }
  }

  const processCommand = async (text: string): Promise<VoiceCommand | null> => {
    // Send to AI for processing
    try {
      const command = await $fetch<VoiceCommand>("/api/shop/voice/process", {
        method: "POST",
        body: { text },
      })

      if (session.value) {
        session.value.commands.push(command)
      }

      // Execute command
      await executeCommand(command)

      return command
    } catch {
      return null
    }
  }

  const executeCommand = async (command: VoiceCommand): Promise<void> => {
    switch (command.type) {
      case "search":
        await navigateTo(`/search?q=${encodeURIComponent(command.value)}`)
        break
      case "add_to_cart":
        // Add product to cart by name or ID
        await $fetch("/api/shop/voice/cart/add", {
          method: "POST",
          body: { productName: command.value },
        })
        break
      case "checkout":
        await navigateTo("/checkout")
        break
      case "filter":
        // Apply filters
        break
      case "navigate":
        // Navigate to category or product
        break
    }
  }

  const speak = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        reject(new Error("Speech synthesis not supported"))
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = navigator.language || "en-US"
      utterance.onend = () => resolve()
      utterance.onerror = reject
      window.speechSynthesis.speak(utterance)
    })
  }

  const getAvailableVoices = (): SpeechSynthesisVoice[] => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return []
    return window.speechSynthesis.getVoices()
  }

  const getVoiceStats = async (): Promise<{
    totalSessions: number
    totalCommands: number
    mostUsedCommand: string
    conversionRate: number
  }> => {
    return await $fetch("/api/shop/voice/stats")
  }

  onMounted(() => {
    checkSupport()
  })

  onUnmounted(() => {
    if (isListening.value) {
      stopListening()
    }
  })

  return {
    isListening: computed(() => isListening.value),
    isSupported: computed(() => isSupported.value),
    transcript: computed(() => transcript.value),
    confidence: computed(() => confidence.value),
    error: computed(() => error.value),
    session: computed(() => session.value),
    startListening,
    stopListening,
    speak,
    getAvailableVoices,
    getVoiceStats,
  }
}
