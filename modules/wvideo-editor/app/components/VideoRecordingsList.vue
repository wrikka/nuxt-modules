<script setup lang="ts">
import type { Recording } from "~/types";

const props = defineProps<{
	recordings: Recording[];
}>();

const emit = defineEmits<{
	preview: [recording: Recording];
	edit: [recording: Recording];
	export: [recording: Recording];
	delete: [recording: Recording];
}>();

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatSize = (bytes: number): string => {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
};

const formatDate = (timestamp: number): string => {
	return new Date(timestamp).toLocaleDateString();
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
		<div class="p-4 border-b border-gray-200 dark:border-gray-700">
			<h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
				<Icon name="mdi:playlist-play" class="w-5 h-5 text-purple-500" />
				Recordings
				<span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
					{{ recordings.length }}
				</span>
			</h3>
		</div>

		<div class="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
			<div
				v-for="recording in recordings"
				:key="recording.id"
				class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
			>
				<div class="flex items-center gap-3">
					<div class="relative w-16 h-10 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
						<Icon name="mdi:video" class="absolute inset-0 m-auto w-5 h-5 text-gray-400" />
					</div>

					<div class="flex-1 min-w-0">
						<p class="font-medium text-gray-900 dark:text-white truncate">
							{{ recording.name }}
						</p>
						<div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
							<span>{{ formatTime(recording.duration) }}</span>
							<span>•</span>
							<span>{{ formatSize(recording.blob.size) }}</span>
							<span>•</span>
							<span>{{ formatDate(recording.timestamp) }}</span>
						</div>
					</div>

					<div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							class="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
							title="Preview"
							@click="emit('preview', recording)"
						>
							<Icon name="mdi:play" class="w-4 h-4" />
						</button>
						<button
							class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
							title="Edit"
							@click="emit('edit', recording)"
						>
							<Icon name="mdi:pencil" class="w-4 h-4" />
						</button>
						<button
							class="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
							title="Export"
							@click="emit('export', recording)"
						>
							<Icon name="mdi:export" class="w-4 h-4" />
						</button>
						<button
							class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
							title="Delete"
							@click="emit('delete', recording)"
						>
							<Icon name="mdi:delete" class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			<div v-if="recordings.length === 0" class="p-8 text-center">
				<Icon name="mdi:video-off" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
				<p class="text-gray-500 dark:text-gray-400 text-sm">No recordings yet</p>
				<p class="text-gray-400 dark:text-gray-500 text-xs mt-1">Recordings will appear here</p>
			</div>
		</div>
	</div>
</template>
