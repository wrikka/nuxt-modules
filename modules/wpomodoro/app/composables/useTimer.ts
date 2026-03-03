import { computed, onUnmounted, readonly, ref, watch } from "vue"
import type { PomodoroSession, TimerPhase, TimerState } from "#pomodoro/types"

const timeLeft = ref(25 * 60)
const totalTime = ref(25 * 60)
const state = ref<TimerState>("idle")
const phase = ref<TimerPhase>("work")
const pomodoroCount = ref(0)
const currentSession = ref<PomodoroSession | null>(null)

let intervalId: ReturnType<typeof setInterval> | null = null

export function useTimer() {
	function start() {
		if (state.value === "running") return
		state.value = "running"

		if (!currentSession.value) {
			currentSession.value = {
				id: crypto.randomUUID(),
				phase: phase.value,
				startedAt: new Date(),
				duration: totalTime.value,
				completed: false,
			}
		}

		intervalId = setInterval(() => {
			if (timeLeft.value > 0) {
				timeLeft.value--
			} else {
				complete()
			}
		}, 1000)
	}

	function pause() {
		if (state.value !== "running") return
		state.value = "paused"
		if (intervalId) {
			clearInterval(intervalId)
			intervalId = null
		}
	}

	function reset() {
		pause()
		state.value = "idle"
		timeLeft.value = totalTime.value
		currentSession.value = null
	}

	function complete() {
		pause()
		state.value = "completed"

		if (currentSession.value) {
			currentSession.value.completed = true
			currentSession.value.completedAt = new Date()
		}

		if (phase.value === "work") {
			pomodoroCount.value++
		}
	}

	function nextPhase(
		settings: {
			workDuration: number
			shortBreakDuration: number
			longBreakDuration: number
			longBreakInterval: number
		},
	) {
		state.value = "idle"
		currentSession.value = null

		if (phase.value === "work") {
			const isLongBreak = pomodoroCount.value % settings.longBreakInterval === 0
			phase.value = isLongBreak ? "longBreak" : "shortBreak"
			totalTime.value = (isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration) * 60
		} else {
			phase.value = "work"
			totalTime.value = settings.workDuration * 60
		}

		timeLeft.value = totalTime.value
	}

	function skipPhase() {
		complete()
	}

	function setTime(seconds: number) {
		timeLeft.value = seconds
		totalTime.value = seconds
	}

	function setPhase(newPhase: TimerPhase, duration: number) {
		phase.value = newPhase
		totalTime.value = duration * 60
		timeLeft.value = totalTime.value
		state.value = "idle"
	}

	const formattedTime = computed(() => {
		const minutes = Math.floor(timeLeft.value / 60)
		const seconds = timeLeft.value % 60
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
	})

	const progress = computed(() => {
		return ((totalTime.value - timeLeft.value) / totalTime.value) * 100
	})

	const isWorkPhase = computed(() => phase.value === "work")
	const isBreakPhase = computed(() => phase.value === "shortBreak" || phase.value === "longBreak")

	onUnmounted(() => {
		pause()
	})

	return {
		timeLeft: readonly(timeLeft),
		totalTime: readonly(totalTime),
		state: readonly(state),
		phase: readonly(phase),
		pomodoroCount: readonly(pomodoroCount),
		currentSession: readonly(currentSession),
		formattedTime,
		progress,
		isWorkPhase,
		isBreakPhase,
		start,
		pause,
		reset,
		complete,
		nextPhase,
		skipPhase,
		setTime,
		setPhase,
	}
}
