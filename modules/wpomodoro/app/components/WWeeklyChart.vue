<script setup lang="ts">
import { usePomodoroStats } from "#pomodoro"

const { dailyStats } = usePomodoroStats()

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const weeklyData = computed(() => {
	const today = new Date()
	const week = []

	for (let i = 6; i >= 0; i--) {
		const date = new Date(today)
		date.setDate(date.getDate() - i)
		const dateStr = date.toISOString().split("T")[0]
		const stats = dailyStats.value.find((d) => d.date === dateStr)

		week.push({
			day: weekDays[date.getDay()],
			pomodoros: stats?.pomodoros ?? 0,
			focusTime: stats?.focusTime ?? 0,
			isToday: i === 0,
		})
	}

	return week
})

const maxPomodoros = computed(() => {
	return Math.max(...weeklyData.value.map((d) => d.pomodoros), 1)
})
</script>

<template>
	<div class="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
		<h3 class="mb-4 text-lg font-semibold">Weekly Overview</h3>

		<div class="flex items-end justify-between gap-2">
			<div
				v-for="day in weeklyData"
				:key="day.day"
				class="flex flex-1 flex-col items-center gap-2"
			>
				<div class="relative w-full">
					<div
						class="w-full rounded-t bg-red-500 transition-all"
						:style="{ height: `${(day.pomodoros / maxPomodoros) * 120}px` }"
						:class="{ 'opacity-50': !day.isToday, 'ring-2 ring-red-300': day.isToday }"
					/>
					<div
						v-if="day.pomodoros > 0"
						class="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium"
					>
						{{ day.pomodoros }}
					</div>
				</div>
				<div class="text-xs" :class="{ 'font-bold text-red-500': day.isToday }">
					{{ day.day }}
				</div>
			</div>
		</div>

		<div class="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
			<span>Total: {{ weeklyData.reduce((a, b) => a + b.pomodoros, 0) }} pomodoros</span>
			<span>{{ weeklyData.reduce((a, b) => a + b.focusTime, 0) }}m focus time</span>
		</div>
	</div>
</template>
