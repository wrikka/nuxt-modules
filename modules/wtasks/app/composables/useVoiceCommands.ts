/**
 * Composable for Voice Commands
 */

// Speech Recognition types
interface SpeechRecognition extends EventTarget {
	continuous: boolean
	interimResults: boolean
	lang: string
	start(): void
	stop(): void
	onstart: (() => void) | null
	onresult: ((event: { results: { transcript: string }[][] }) => void) | null
	onerror: ((event: { error: string }) => void) | null
	onend: (() => void) | null
}

declare global {
	interface Window {
		SpeechRecognition?: new () => SpeechRecognition
		webkitSpeechRecognition?: new () => SpeechRecognition
	}
}

export const useVoiceCommands = () => {
	const { $toast } = useNuxtApp()

	const isListening = useState<boolean>("voice-listening", () => false)
	const transcript = useState<string>("voice-transcript", () => "")
	const isSupported = useState<boolean>("voice-supported", () => false)

	let recognition: SpeechRecognition | null = null

	/**
	 * Check if browser supports speech recognition
	 */
	const checkSupport = () => {
		if (typeof window === "undefined") return false
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
		isSupported.value = !!SpeechRecognition
		return isSupported.value
	}

	/**
	 * Initialize speech recognition
	 */
	const initRecognition = () => {
		if (typeof window === "undefined") return null

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
		if (!SpeechRecognition) return null

		recognition = new SpeechRecognition()
		recognition.continuous = false
		recognition.interimResults = false
		recognition.lang = "en-US"

		recognition.onstart = () => {
			isListening.value = true
			transcript.value = ""
		}

		recognition.onresult = (event) => {
			transcript.value = event.results[0][0].transcript
		}

		recognition.onerror = (event) => {
			console.error("Speech recognition error:", event.error)
			isListening.value = false
			$toast.error("Voice recognition failed")
		}

		recognition.onend = () => {
			isListening.value = false
			processCommand(transcript.value)
		}

		return recognition
	}

	/**
	 * Start listening
	 */
	const startListening = () => {
		if (!checkSupport()) {
			$toast.error("Voice commands not supported in this browser")
			return
		}

		if (!recognition) {
			initRecognition()
		}

		try {
			recognition?.start()
		} catch {
			$toast.error("Could not start voice recognition")
		}
	}

	/**
	 * Stop listening
	 */
	const stopListening = () => {
		recognition?.stop()
		isListening.value = false
	}

	/**
	 * Process voice command
	 */
	const processCommand = (text: string) => {
		const lower = text.toLowerCase()

		// Task creation commands
		if (lower.includes("create task") || lower.includes("new task") || lower.includes("add task")) {
			const taskTitle = text.replace(/(create|new|add) task/i, "").trim()
			emit("create-task", taskTitle)
			return
		}

		// Status change commands
		if (lower.includes("mark as done") || lower.includes("complete task")) {
			emit("change-status", "Done")
			return
		}

		if (lower.includes("start task") || lower.includes("in progress")) {
			emit("change-status", "In Progress")
			return
		}

		// Navigation commands
		if (lower.includes("show kanban") || lower.includes("open board")) {
			emit("navigate", "kanban")
			return
		}

		if (lower.includes("show calendar")) {
			emit("navigate", "calendar")
			return
		}

		if (lower.includes("go to dashboard")) {
			emit("navigate", "dashboard")
			return
		}

		// Timer commands
		if (lower.includes("start timer") || lower.includes("begin timer")) {
			emit("timer-start")
			return
		}

		if (lower.includes("stop timer") || lower.includes("end timer")) {
			emit("timer-stop")
			return
		}

		// Search commands
		if (lower.includes("search for") || lower.includes("find")) {
			const query = text.replace(/(search for|find)/i, "").trim()
			emit("search", query)
			return
		}

		// Unknown command
		emit("unknown-command", text)
	}

	/**
	 * Emit event helper
	 */
	const emit = (event: string, data?: string) => {
		// Use Nuxt app events or custom event bus
		$toast.info(`Voice command: ${event}`)
	}

	return {
		isListening,
		transcript,
		isSupported,
		checkSupport,
		startListening,
		stopListening,
		processCommand,
	}
}
