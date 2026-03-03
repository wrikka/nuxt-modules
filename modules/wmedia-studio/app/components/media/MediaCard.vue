<script setup lang="ts">
import type { MediaItem } from "#shared/types/media";

defineProps<{
	media: MediaItem;
}>();

defineEmits<{
	select: [media: MediaItem];
	preview: [media: MediaItem];
	download: [media: MediaItem];
	delete: [media: MediaItem];
}>();

const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${
		sizes[i]
	}`;
};

const formatDuration = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};
</script>

<template>
	<div class="media-card group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
		<div class="aspect-square overflow-hidden bg-gray-100">
			<img
				v-if="media.thumbnail"
				:src="media.thumbnail"
				:alt="media.name"
				class="h-full w-full object-cover transition-transform group-hover:scale-105"
			/>
			<video
				v-else-if="media.type === 'video'"
				:src="media.url"
				class="h-full w-full object-cover"
			/>
			<div
				v-else-if="media.type === 'audio'"
				class="flex h-full w-full items-center justify-center"
			>
				<i class="i-mdi-music text-6xl text-gray-400" />
			</div>
			<img
				v-else
				:src="media.url"
				:alt="media.name"
				class="h-full w-full object-cover transition-transform group-hover:scale-105"
			/>
		</div>

		<div class="p-3">
			<h3
				class="truncate text-sm font-medium text-gray-900 dark:text-white"
				:title="media.name"
			>
				{{ media.name }}
			</h3>
			<div class="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
				<span>{{ formatFileSize(media.size) }}</span>
				<span v-if="media.duration">{{ formatDuration(media.duration) }}</span>
			</div>
			<div
				v-if="media.tags && media.tags.length > 0"
				class="mt-2 flex flex-wrap gap-1"
			>
				<span
					v-for="tag in media.tags.slice(0, 3)"
					:key="tag"
					class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs dark:bg-blue-900/30 dark:text-blue-400"
				>{{ tag }}</span>
			</div>
		</div>

		<div class="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
			<button
				@click="$emit('select', media)"
				class="rounded-full bg-white p-2 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
				title="Select"
			>
				<i class="i-mdi-check" />
			</button>
			<button
				@click="$emit('preview', media)"
				class="rounded-full bg-white p-2 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
				title="Preview"
			>
				<i class="i-mdi-eye" />
			</button>
			<button
				@click="$emit('download', media)"
				class="rounded-full bg-white p-2 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
				title="Download"
			>
				<i class="i-mdi-download" />
			</button>
			<button
				@click="$emit('delete', media)"
				class="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
				title="Delete"
			>
				<i class="i-mdi-delete" />
			</button>
		</div>
	</div>
</template>
