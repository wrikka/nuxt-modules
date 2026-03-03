<script setup lang="ts">
import { useTimer } from "#pomodoro"

const { formattedTime, progress, phase, state, isWorkPhase, start, pause, reset } = useTimer()

const ringColor = computed(() => {
	if (phase.value === "work") return "text-red-500"
	if (phase.value === "shortBreak") return "text-green-500"
	return "text-blue-500"
})

const radius = 120
const circumference = 2 * Math.PI * radius
const strokeDashoffset = computed(() => circumference - (progress.value / 100) * circumference)
</script>

<template>
	<div class="relative flex items-center justify-center">
		<svg class="transform -rotate-90" width="280" height="280" viewBox="0 0 280 280">
			<circle
				cx="140"
				cy="140"
				:r="radius"
				stroke="currentColor"
				stroke-width="8"
				fill="none"
				class="text-gray-200 dark:text-gray-700"
			/>
			<circle
				cx="140"
				cy="140"
				:r="radius"
				stroke="currentColor"
				stroke-width="8"
				fill="none"
				:stroke-dasharray="circumference"
				:stroke-dashoffset="strokeDashoffset"
				stroke-linecap="round"
				class="transition-all duration-1000 ease-linear"
				:class="ringColor"
			/>
		</svg>
		<div class="absolute inset-0 flex flex-col items-center justify-center">
			<div class="text-6xl font-bold tabular-nums tracking-tight">
				{{ formattedTime }}
			</div>
			<div class="mt-2 text-sm uppercase tracking-wider opacity-75">
				{{ phase === "work" ? "Focus Time" : phase === "shortBreak" ? "Short Break" : "Long Break" }}
			</div>
			<div class="mt-1 text-xs opacity-50">
				{{ state === "running" ? "Running" : state === "paused" ? "Paused" : state === "completed" ? "Completed" : "Ready" }}
			</div>
		</div>
	</div>
</template>
