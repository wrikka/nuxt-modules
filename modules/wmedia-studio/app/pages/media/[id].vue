<script setup lang="ts">
import type { MediaItem } from "#shared/types/media";

const route = useRoute();
const {
	assets: mediaItems,
	loading,
	error,
	loadAssets,
	formatFileSize,
	formatDuration,
} = useMediaLibrary();

const media = ref<MediaItem | null>(null);

onMounted(async () => {
	await loadAssets();
	const id = route.params.id as string;
	media.value = mediaItems.value.find((m) => m.id === id) || null;
});

const handleDownload = () => {
	if (!media.value) return;
	const link = document.createElement("a");
	link.href = media.value.url;
	link.download = media.value.name;
	link.click();
};

const handleDelete = async () => {
	if (!media.value) return;
	if (confirm(`Are you sure you want to delete "${media.value.name}"?`)) {
		try {
			await $fetch(`/api/assets/${media.value.id}`, {
				method: "DELETE",
			});
			await navigateTo("/media");
		} catch (err) {
			console.error("Failed to delete media:", err);
		}
	}
};
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="mb-6">
				<NuxtLink
					to="/media"
					class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
				>
					<i class="i-mdi-arrow-left mr-1" />
					Back to Media Library
				</NuxtLink>
			</div>

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
				v-else-if="!media"
				class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
			>
				<i class="i-mdi-file-question text-6xl" />
				<p class="mt-2 text-lg">Media not found</p>
			</div>

			<MediaDetailView
				v-else
				:media="media"
				@download="handleDownload"
				@delete="handleDelete"
			/>
		</div>
	</div>
</template>
