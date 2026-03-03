import { computed, readonly, ref } from "vue"
import type { PomodoroSettings } from "#pomodoro/types"

const settings = ref<PomodoroSettings>({
	workDuration: 25,
	shortBreakDuration: 5,
	longBreakDuration: 15,
	longBreakInterval: 4,
	autoStartBreaks: false,
	autoStartPomodoros: false,
	enableAudio: true,
	enableNotifications: true,
	volume: 0.5,
})

export function useSettings() {
	const workDuration = computed(() => settings.value.workDuration)
	const shortBreakDuration = computed(() => settings.value.shortBreakDuration)
	const longBreakDuration = computed(() => settings.value.longBreakDuration)
	const longBreakInterval = computed(() => settings.value.longBreakInterval)
	const autoStartBreaks = computed(() => settings.value.autoStartBreaks)
	const autoStartPomodoros = computed(() => settings.value.autoStartPomodoros)
	const enableAudio = computed(() => settings.value.enableAudio)
	const enableNotifications = computed(() => settings.value.enableNotifications)
	const volume = computed(() => settings.value.volume)

	function updateSettings(newSettings: Partial<PomodoroSettings>) {
		settings.value = { ...settings.value, ...newSettings }
		saveSettings()
	}

	function updateDurations(
		work: number,
		shortBreak: number,
		longBreak: number,
	) {
		settings.value.workDuration = work
		settings.value.shortBreakDuration = shortBreak
		settings.value.longBreakDuration = longBreak
		saveSettings()
	}

	function updateAutoStart(breaks: boolean, pomodoros: boolean) {
		settings.value.autoStartBreaks = breaks
		settings.value.autoStartPomodoros = pomodoros
		saveSettings()
	}

	function updateAudio(enabled: boolean, vol: number) {
		settings.value.enableAudio = enabled
		settings.value.volume = vol
		saveSettings()
	}

	function saveSettings() {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem("pomodoro-settings", JSON.stringify(settings.value))
		}
	}

	function loadSettings() {
		if (typeof localStorage !== "undefined") {
			const saved = localStorage.getItem("pomodoro-settings")
			if (saved) {
				settings.value = { ...settings.value, ...JSON.parse(saved) }
			}
		}
	}

	function resetToDefaults() {
		settings.value = {
			workDuration: 25,
			shortBreakDuration: 5,
			longBreakDuration: 15,
			longBreakInterval: 4,
			autoStartBreaks: false,
			autoStartPomodoros: false,
			enableAudio: true,
			enableNotifications: true,
			volume: 0.5,
		}
		saveSettings()
	}

	return {
		settings: readonly(settings),
		workDuration,
		shortBreakDuration,
		longBreakDuration,
		longBreakInterval,
		autoStartBreaks,
		autoStartPomodoros,
		enableAudio,
		enableNotifications,
		volume,
		updateSettings,
		updateDurations,
		updateAutoStart,
		updateAudio,
		loadSettings,
		resetToDefaults,
	}
}
