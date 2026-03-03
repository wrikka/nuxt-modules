<script setup lang="ts">
import { useTimer } from "#pomodoro"

const { phase, state, pomodoroCount } = useTimer()

const statusColor = computed(() => {
	if (state.value === "running") return "bg-green-500"
	if (state.value === "paused") return "bg-yellow-500"
	if (state.value === "completed") return "bg-blue-500"
	return "bg-gray-400"
})

const phaseIcon = computed(() => {
	if (phase.value === "work") return "🍅"
	if (phase.value === "shortBreak") return "☕"
	return "🌴"
})
</script>

<template>
	<div class="flex items-center gap-3 rounded-lg bg-white/50 p-3 backdrop-blur-sm dark:bg-gray-800/50">
		<div class="flex items-center gap-2">
			<span class="text-2xl">{{ phaseIcon }}</span>
			<div class="flex flex-col">
				<span class="text-sm font-medium">
					{{ phase === "work" ? "Focus" : phase === "shortBreak" ? "Short Break" : "Long Break" }}
				</span>
				<span class="text-xs opacity-75">{{ state }}</span>
			</div>
		</div>
		<div class="h-8 w-px bg-gray-300 dark:bg-gray-600" />
		<div class="flex items-center gap-2">
			<span class="text-sm font-medium">{{ pomodoroCount }}</span>
			<span class="text-xs opacity-75">completed</span>
		</div>
		<div class="ml-2 h-2 w-2 rounded-full" :class="statusColor" />
	</div>
</template>
