<script setup lang="ts">
import type { Recording } from "./types";

defineProps<{
	isRecording: boolean;
	isPaused: boolean;
	hasStream: boolean;
	recordings: Recording[];
}>();

defineEmits<{
	start: [];
	stop: [];
	pause: [];
	resume: [];
	download: [recording: Recording];
	upload: [recording: Recording];
	delete: [recording: Recording];
}>();
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
			Controls
		</h2>

		<div class="flex items-center justify-center space-x-4">
			<button
				v-if="!isRecording && hasStream"
				@click="$emit('start')"
				class="flex items-center space-x-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
			>
				<Icon name="mdi:record-rec" class="w-6 h-6" />
				<span>Start Recording</span>
			</button>

			<button
				v-if="isRecording && !isPaused"
				@click="$emit('pause')"
				class="flex items-center space-x-2 px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
			>
				<Icon name="mdi:pause" class="w-6 h-6" />
				<span>Pause</span>
			</button>

			<button
				v-if="isRecording && isPaused"
				@click="$emit('resume')"
				class="flex items-center space-x-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
			>
				<Icon name="mdi:play" class="w-6 h-6" />
				<span>Resume</span>
			</button>

			<button
				v-if="isRecording"
				@click="$emit('stop')"
				class="flex items-center space-x-2 px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
			>
				<Icon name="mdi:stop" class="w-6 h-6" />
				<span>Stop Recording</span>
			</button>

			<button
				v-if="!isRecording && !hasStream"
				@click="$emit('start')"
				class="flex items-center space-x-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
			>
				<Icon name="mdi:play" class="w-6 h-6" />
				<span>Start</span>
			</button>
		</div>

		<div
			v-if="recordings.length > 0"
			class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
		>
			<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
				Quick Actions
			</h3>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="recording in recordings.slice(0, 3)"
					:key="recording.id"
					@click="$emit('upload', recording)"
					class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
				>
					<Icon name="mdi:cloud-upload" class="w-4 h-4" />
					<span>Upload {{ recording.name }}</span>
				</button>
			</div>
		</div>
	</div>
</template>
