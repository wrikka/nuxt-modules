/**
 * Composable for Pomodoro / Focus Mode
 */
export const usePomodoro = () => {
	const { $toast } = useNuxtApp()

	const isRunning = useState<boolean>("pomodoro-running", () => false)
	const isPaused = useState<boolean>("pomodoro-paused", () => false)
	const timeRemaining = useState<number>("pomodoro-time", () => 25 * 60) // 25 minutes in seconds
	const currentMode = useState<"work" | "shortBreak" | "longBreak">("pomodoro-mode", () => "work")
	const completedPomodoros = useState<number>("completed-pomodoros", () => 0)
	const isFocusMode = useState<boolean>("focus-mode", () => false)

	let timerInterval: ReturnType<typeof setInterval> | null = null

	const modes = {
		work: { minutes: 25, label: "Focus" },
		shortBreak: { minutes: 5, label: "Short Break" },
		longBreak: { minutes: 15, label: "Long Break" },
	}

	/**
	 * Start timer
	 */
	const start = () => {
		if (isRunning.value) return

		isRunning.value = true
		isPaused.value = false

		timerInterval = setInterval(() => {
			if (timeRemaining.value > 0) {
				timeRemaining.value--
			} else {
				complete()
			}
		}, 1000)
	}

	/**
	 * Pause timer
	 */
	const pause = () => {
		if (!isRunning.value) return

		isPaused.value = true
		isRunning.value = false
		if (timerInterval) clearInterval(timerInterval)
	}

	/**
	 * Resume timer
	 */
	const resume = () => {
		if (!isPaused.value) return
		start()
	}

	/**
	 * Stop timer
	 */
	const stop = () => {
		isRunning.value = false
		isPaused.value = false
		if (timerInterval) clearInterval(timerInterval)
	}

	/**
	 * Reset timer
	 */
	const reset = () => {
		stop()
		timeRemaining.value = modes[currentMode.value].minutes * 60
	}

	/**
	 * Complete current session
	 */
	const complete = () => {
		stop()

		if (currentMode.value === "work") {
			completedPomodoros.value++
			$toast.success("Pomodoro completed! Time for a break.")

			// Switch to break
			if (completedPomodoros.value % 4 === 0) {
				switchMode("longBreak")
			} else {
				switchMode("shortBreak")
			}
		} else {
			$toast.success("Break over! Ready to focus?")
			switchMode("work")
		}
	}

	/**
	 * Switch mode
	 */
	const switchMode = (mode: "work" | "shortBreak" | "longBreak") => {
		stop()
		currentMode.value = mode
		timeRemaining.value = modes[mode].minutes * 60
	}

	/**
	 * Toggle focus mode
	 */
	const toggleFocusMode = () => {
		isFocusMode.value = !isFocusMode.value
		if (isFocusMode.value) {
			$toast.success("Focus mode enabled")
		}
	}

	/**
	 * Format time as MM:SS
	 */
	const formatTime = (seconds: number = timeRemaining.value): string => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
	}

	/**
	 * Get progress percentage
	 */
	const progress = computed(() => {
		const total = modes[currentMode.value].minutes * 60
		return ((total - timeRemaining.value) / total) * 100
	})

	return {
		isRunning,
		isPaused,
		timeRemaining,
		currentMode,
		completedPomodoros,
		isFocusMode,
		progress,
		start,
		pause,
		resume,
		stop,
		reset,
		complete,
		switchMode,
		toggleFocusMode,
		formatTime,
	}
}
