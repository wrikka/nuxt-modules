<script setup lang="ts">
import { useSoundscapes } from "#pomodoro"

const { soundscapes, currentSoundscape, isPlaying, volume, play, stop, setVolume, toggleMute, isMuted } = useSoundscapes()

function handlePlay(soundscape: typeof soundscapes.value[0]) {
	if (currentSoundscape.value?.id === soundscape.id && isPlaying.value) {
		stop()
	} else {
		play(soundscape)
	}
}
</script>

<template>
	<div class="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-lg font-semibold">Soundscapes</h3>
			<button
				class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
				:class="{ 'text-red-500': isMuted }"
				@click="toggleMute"
			>
				<svg v-if="isMuted" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
				</svg>
				<svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
				</svg>
			</button>
		</div>

		<div class="mb-4">
			<input
				type="range"
				min="0"
				max="1"
				step="0.1"
				:value="volume"
				@input="(e) => setVolume(Number((e.target as HTMLInputElement).value))"
				class="w-full"
			/>
		</div>

		<div class="grid grid-cols-3 gap-3">
			<button
				v-for="sound in soundscapes"
				:key="sound.id"
				class="flex flex-col items-center gap-2 rounded-lg p-4 transition-all"
				:class="currentSoundscape?.id === sound.id && isPlaying
					? 'bg-red-100 text-red-600 dark:bg-red-900/30'
					: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'"
				@click="handlePlay(sound)"
			>
				<span class="text-2xl">{{ sound.icon }}</span>
				<span class="text-xs">{{ sound.name }}</span>
			</button>
		</div>
	</div>
</template>
