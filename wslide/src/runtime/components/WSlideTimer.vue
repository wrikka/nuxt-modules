<script setup lang="ts">
import { useTimer } from "../../composables/useTimer";

const timer = useTimer();
</script>

<template>
	<div
		class="fixed top-4 right-4 z-50 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-lg font-mono text-lg tabular-nums transition-all"
		:class="{ 'ring-2 ring-green-500': timer.isRunning.value }"
	>
		<div class="flex items-center gap-3">
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10" />
				<polyline points="12 6 12 12 16 14" />
			</svg>
			<span>{{ timer.formattedTime.value }}</span>
			<div class="flex gap-1">
				<button
					class="p-1 hover:bg-white/20 rounded transition-colors"
					@click="timer.isRunning.value ? timer.stop() : timer.start()"
				>
					<svg v-if="!timer.isRunning.value" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
						<polygon points="5 3 19 12 5 21 5 3" />
					</svg>
					<svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
						<rect x="6" y="4" width="4" height="16" />
						<rect x="14" y="4" width="4" height="16" />
					</svg>
				</button>
				<button
					class="p-1 hover:bg-white/20 rounded transition-colors"
					@click="timer.reset()"
				>
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="23 4 23 10 17 10" />
						<path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>
