import { computed, onUnmounted, readonly, ref } from "vue"

export function useFocusMode() {
	const isActive = ref(false)
	const duration = ref(25) // minutes
	const remainingTime = ref(25 * 60) // seconds
	const timerInterval = ref<NodeJS.Timeout | null>(null)
	const completedSessions = ref(0)

	function activate() {
		isActive.value = true
		remainingTime.value = duration.value * 60
		startTimer()
		document.body.classList.add("focus-mode")
	}

	function deactivate() {
		isActive.value = false
		stopTimer()
		document.body.classList.remove("focus-mode")
	}

	function toggle() {
		if (isActive.value) {
			deactivate()
		}
		else {
			activate()
		}
	}

	function startTimer() {
		timerInterval.value = setInterval(() => {
			if (remainingTime.value > 0) {
				remainingTime.value--
			}
			else {
				completeSession()
			}
		}, 1000)
	}

	function stopTimer() {
		if (timerInterval.value) {
			clearInterval(timerInterval.value)
			timerInterval.value = null
		}
	}

	function completeSession() {
		stopTimer()
		completedSessions.value++
		remainingTime.value = duration.value * 60
		// Could emit notification here
	}

	function setDuration(minutes: number) {
		duration.value = minutes
		if (!isActive.value) {
			remainingTime.value = minutes * 60
		}
	}

	const formattedTime = computed(() => {
		const mins = Math.floor(remainingTime.value / 60)
		const secs = remainingTime.value % 60
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
	})

	const progress = computed(() => {
		const total = duration.value * 60
		return ((total - remainingTime.value) / total) * 100
	})

	onUnmounted(() => {
		stopTimer()
	})

	return {
		isActive: readonly(isActive),
		formattedTime,
		progress,
		completedSessions: readonly(completedSessions),
		duration: readonly(duration),
		activate,
		deactivate,
		toggle,
		setDuration,
	}
}
