import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { Command, VoiceCommandResult } from '../types'
import { usePalette } from './usePalette'

export interface UseVoiceCommandsReturn {
	/** Whether voice recognition is active */
	isListening: Ref<boolean>
	/** Recognition result transcript */
	transcript: Ref<string>
	/** Recognition confidence */
	confidence: Ref<number>
	/** Whether voice commands are supported */
	isSupported: boolean
	/** Start voice recognition */
	startListening: () => void
	/** Stop voice recognition */
	stopListening: () => void
	/** Toggle listening state */
	toggleListening: () => void
	/** Match voice input to command */
	matchCommand: (transcript: string) => Command | undefined
	/** Last matched command */
	lastMatch: Ref<VoiceCommandResult | undefined>
	/** Available voice commands (commands with voice keywords) */
	voiceCommands: Ref<Command[]>
}

export function useVoiceCommands(paletteId?: string): UseVoiceCommandsReturn {
	const palette = usePalette({ id: paletteId ?? 'default' })
	const isListening = ref(false)
	const transcript = ref('')
	const confidence = ref(0)
	const lastMatch = ref<VoiceCommandResult | undefined>()

	let recognition: SpeechRecognition | null = null

	// Check for browser support
	const isSupported = typeof window !== 'undefined' &&
		('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

	if (isSupported && typeof window !== 'undefined') {
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
		recognition = new SpeechRecognition()
		recognition.continuous = false
		recognition.interimResults = false
		recognition.lang = 'en-US'

		recognition.onstart = () => {
			isListening.value = true
		}

		recognition.onend = () => {
			isListening.value = false
		}

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			const result = event.results[0][0]
			transcript.value = result.transcript
			confidence.value = result.confidence

			// Try to match command
			const matched = matchCommand(result.transcript)
			if (matched) {
				lastMatch.value = {
					transcript: result.transcript,
					confidence: result.confidence,
					matchedCommand: matched,
				}
				// Execute the command
				palette.execute(matched.id)
			} else {
				lastMatch.value = {
					transcript: result.transcript,
					confidence: result.confidence,
				}
			}
		}

		recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
			console.error('Voice recognition error:', event.error)
			isListening.value = false
		}
	}

	const startListening = () => {
		if (recognition && !isListening.value) {
			transcript.value = ''
			confidence.value = 0
			lastMatch.value = undefined
			recognition.start()
		}
	}

	const stopListening = () => {
		if (recognition && isListening.value) {
			recognition.stop()
		}
	}

	const toggleListening = () => {
		if (isListening.value) {
			stopListening()
		} else {
			startListening()
		}
	}

	const matchCommand = (input: string): Command | undefined => {
		const normalized = input.toLowerCase().trim()

		// Try exact match first
		const exact = palette.results.value.find(c =>
			c.title.toLowerCase() === normalized ||
			c.name.toLowerCase() === normalized
		)
		if (exact) return exact

		// Try keyword matching
		for (const cmd of palette.results.value) {
			const keywords = [
				cmd.title.toLowerCase(),
				cmd.name.toLowerCase(),
				...(cmd.keywords?.map(k => k.toLowerCase()) || []),
			]

			for (const keyword of keywords) {
				if (normalized.includes(keyword)) {
					return cmd
				}
			}
		}

		return undefined
	}

	const voiceCommands = computed(() => {
		return palette.results.value.filter(c =>
			c.keywords?.some(k => k.startsWith('voice:'))
		)
	})

	return {
		isListening,
		transcript,
		confidence,
		isSupported,
		startListening,
		stopListening,
		toggleListening,
		matchCommand,
		lastMatch,
		voiceCommands,
	}
}
