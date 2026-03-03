<script setup lang="ts">
import { usePomodoroStats } from "#pomodoro"

const { stats, todayPomodoros, todayFocusTime, dailyProgress, weeklyProgress } = usePomodoroStats()

const formatTime = (minutes: number) => {
	const hours = Math.floor(minutes / 60)
	const mins = minutes % 60
	return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}
</script>

<template>
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
			<div class="mb-2 text-sm text-gray-600 dark:text-gray-400">Today's Pomodoros</div>
			<div class="text-3xl font-bold text-red-500">{{ todayPomodoros }}</div>
			<div class="mt-1 text-xs opacity-75">Goal: {{ stats.dailyGoal }}</div>
		</div>

		<div class="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
			<div class="mb-2 text-sm text-gray-600 dark:text-gray-400">Focus Time</div>
			<div class="text-3xl font-bold text-blue-500">{{ formatTime(todayFocusTime) }}</div>
			<div class="mt-1 text-xs opacity-75">minutes</div>
		</div>

		<div class="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
			<div class="mb-2 text-sm text-gray-600 dark:text-gray-400">Daily Progress</div>
			<div class="text-3xl font-bold text-green-500">{{ Math.round(dailyProgress) }}%</div>
			<div class="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
				<div
					class="h-full rounded-full bg-green-500 transition-all"
					:style="{ width: `${dailyProgress}%` }"
				/>
			</div>
		</div>

		<div class="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
			<div class="mb-2 text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
			<div class="text-3xl font-bold text-purple-500">{{ stats.currentStreak }} 🔥</div>
			<div class="mt-1 text-xs opacity-75">Best: {{ stats.longestStreak }}</div>
		</div>
	</div>
</template>
