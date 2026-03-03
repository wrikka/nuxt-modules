<script setup lang="ts">
import type { MediaItem } from "#shared/types/media";

defineProps<{
	mediaItems: MediaItem[];
	loading?: boolean;
	error?: string | null;
}>();

defineEmits<{
	select: [media: MediaItem];
	preview: [media: MediaItem];
	download: [media: MediaItem];
	delete: [media: MediaItem];
}>();
</script>

<template>
	<div class="media-list">
		<div v-if="loading" class="flex items-center justify-center py-12">
			<i class="i-mdi-loading animate-spin text-4xl text-blue-500" />
		</div>

		<div
			v-else-if="error"
			class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
		>
			{{ error }}
		</div>

		<div
			v-else-if="mediaItems.length === 0"
			class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
		>
			<i class="i-mdi-folder-open-outline text-6xl" />
			<p class="mt-2 text-lg">No media found</p>
			<p class="text-sm">Upload your first media file to get started</p>
		</div>

		<div
			v-else
			class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
		>
			<MediaCard
				v-for="media in mediaItems"
				:key="media.id"
				:media="media"
				@select="$emit('select', $event)"
				@preview="$emit('preview', $event)"
				@download="$emit('download', $event)"
				@delete="$emit('delete', $event)"
			/>
		</div>
	</div>
</template>
