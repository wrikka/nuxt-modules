<script setup lang="ts">
import { useRecording } from "../composables/useRecording";

const recording = useRecording();
</script>

<template>
	<div
		v-if="recording.isRecording.value"
		class="fixed top-4 left-4 z-50 flex items-center gap-3 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg"
	>
		<div class="flex items-center gap-2">
			<div class="w-3 h-3 bg-white rounded-full animate-pulse" />
			<span class="font-medium">REC</span>
		</div>
		<span class="font-mono">{{ recording.formattedTime.value }}</span>
		<button
			class="p-1 hover:bg-white/20 rounded transition-colors"
			@click="recording.stopRecording()"
		>
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
				<rect x="4" y="4" width="16" height="16" rx="2" />
			</svg>
		</button>
	</div>
</template>
