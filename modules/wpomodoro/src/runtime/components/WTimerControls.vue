<script setup lang="ts">
import { useAudio, useSettings, useTimer } from "#pomodoro"

const { state, start, pause, reset, skipPhase, complete, nextPhase } = useTimer()
const { playSound } = useAudio()
const { settings } = useSettings()

const isRunning = computed(() => state.value === "running")

function handleStartPause() {
	if (isRunning.value) {
		pause()
	} else {
		start()
		playSound("click", settings.value.volume)
	}
}

function handleReset() {
	reset()
	playSound("click", settings.value.volume)
}

function handleSkip() {
	skipPhase()
	playSound("click", settings.value.volume)
}

function handleComplete() {
	complete()
	playSound("complete", settings.value.volume)
	nextPhase(settings.value)
}
</script>

<template>
	<div class="flex items-center gap-4">
		<button
			class="flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all duration-200"
			:class="isRunning
				? 'bg-yellow-500 hover:bg-yellow-600 text-white'
				: 'bg-red-500 hover:bg-red-600 text-white'"
			@click="handleStartPause"
		>
			<svg v-if="isRunning" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" />
			</svg>
			<svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			{{ isRunning ? "Pause" : "Start" }}
		</button>

		<button
			class="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-3 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
			@click="handleReset"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
			</svg>
			Reset
		</button>

		<button
			class="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-3 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
			@click="handleSkip"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
			</svg>
			Skip
		</button>

		<button
			v-if="state === 'completed'"
			class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-green-600"
			@click="handleComplete"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			Next
		</button>
	</div>
</template>
