/// <reference types="nuxt" />
import { computed, readonly, ref } from "vue"
import { useFetch } from "nuxt/app"
import type { DailyStats, PomodoroStats } from "#pomodoro/types"

const dailyStats = ref<DailyStats[]>([])
const currentStreak = ref(0)
const longestStreak = ref(0)
const dailyGoal = ref(8)
const weeklyGoal = ref(40)

export function usePomodoroStats() {
	const totalPomodoros = computed(() => {
		return dailyStats.value.reduce((sum: number, day: DailyStats) => sum + day.pomodoros, 0)
	})

	const totalFocusTime = computed(() => {
		return dailyStats.value.reduce((sum: number, day: DailyStats) => sum + day.focusTime, 0)
	})

	const todayPomodoros = computed(() => {
		const today = new Date().toISOString().split("T")[0]
		const todayStats = dailyStats.value.find((d) => d.date === today)
		return todayStats?.pomodoros ?? 0
	})

	const todayFocusTime = computed(() => {
		const today = new Date().toISOString().split("T")[0]
		const todayStats = dailyStats.value.find((d) => d.date === today)
		return todayStats?.focusTime ?? 0
	})

	const dailyProgress = computed(() => {
		return Math.min((todayPomodoros.value / dailyGoal.value) * 100, 100)
	})

	const weeklyProgress = computed(() => {
		const thisWeekPomodoros = dailyStats.value.slice(-7).reduce((sum: number, day: DailyStats) => sum + day.pomodoros, 0)
		return Math.min((thisWeekPomodoros / weeklyGoal.value) * 100, 100)
	})

	const stats = computed<PomodoroStats>(() => ({
		totalPomodoros: totalPomodoros.value,
		totalFocusTime: totalFocusTime.value,
		currentStreak: currentStreak.value,
		longestStreak: longestStreak.value,
		dailyGoal: dailyGoal.value,
		weeklyGoal: weeklyGoal.value,
		dailyProgress: dailyProgress.value,
		weeklyProgress: weeklyProgress.value,
	}))

	async function loadStats() {
		const { data } = await useFetch<DailyStats[]>("/api/pomodoro/stats")
		if (data.value) {
			dailyStats.value = data.value
			calculateStreaks()
		}
	}

	async function recordSession(pomodoros: number, focusTime: number) {
		const today = new Date().toISOString().split("T")[0]
		const existingIndex = dailyStats.value.findIndex((d: DailyStats) => d.date === today)

		if (existingIndex >= 0) {
			dailyStats.value[existingIndex].pomodoros += pomodoros
			dailyStats.value[existingIndex].focusTime += focusTime
		} else {
			dailyStats.value.push({
				date: today,
				pomodoros,
				focusTime,
				tasks: [],
			})
		}

		await $fetch("/api/pomodoro/stats", {
			method: "POST",
			body: { pomodoros, focusTime, date: today },
		})

		calculateStreaks()
	}

	function calculateStreaks() {
		const sorted = [...dailyStats.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		let streak = 0

		for (const day of sorted) {
			if (day.pomodoros >= dailyGoal.value) {
				streak++
			} else {
				break
			}
		}

		currentStreak.value = streak
		longestStreak.value = Math.max(longestStreak.value, streak)
	}

	function setGoals(daily: number, weekly: number) {
		dailyGoal.value = daily
		weeklyGoal.value = weekly
	}

	return {
		stats,
		dailyStats: readonly(dailyStats),
		todayPomodoros,
		todayFocusTime,
		dailyProgress,
		weeklyProgress,
		loadStats,
		recordSession,
		setGoals,
	}
}
