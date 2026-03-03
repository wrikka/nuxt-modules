<script setup lang="ts">
import { useAudio, useTimer, useSettings } from "#pomodoro"

const { state, formattedTime, progress, phase } = useTimer()
const { playSound } = useAudio()
const { settings } = useSettings()

const isRunning = computed(() => state.value === "running")

const phaseColor = computed(() => {
	if (phase.value === "work") return "bg-red-500"
	if (phase.value === "shortBreak") return "bg-green-500"
	return "bg-blue-500"
})

function toggleTimer() {
	// Logic handled by main timer
}

watch(state, (newState, oldState) => {
	if (newState === "completed" && oldState === "running") {
		playSound("complete", settings.value.volume)
	}
})
</script>

<template>
	<div
		class="fixed z-50 flex items-center gap-3 rounded-full bg-white/95 px-4 py-2 shadow-lg backdrop-blur-sm dark:bg-gray-800/95"
		v-bind="$attrs"
	>
		<div class="relative h-10 w-10">
			<svg class="h-full w-full -rotate-90 transform">
				<circle
					cx="20"
					cy="20"
					r="16"
					stroke="currentColor"
					stroke-width="3"
					fill="none"
					class="text-gray-200 dark:text-gray-700"
				/>
				<circle
					cx="20"
					cy="20"
					r="16"
					stroke="currentColor"
					stroke-width="3"
					fill="none"
					stroke-linecap="round"
					:stroke-dasharray="2 * Math.PI * 16"
					:stroke-dashoffset="2 * Math.PI * 16 * (1 - progress / 100)"
					class="transition-all duration-1000"
					:class="phaseColor"
				/>
			</svg>
		</div>
		<span class="text-lg font-bold tabular-nums">{{ formattedTime }}</span>
		<span class="text-xs uppercase opacity-75">{{ phase }}</span>
	</div>
</template>
