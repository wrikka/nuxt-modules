<script setup lang="ts">
import type { MediaItem } from "#shared/types/media";

const { uploadFile, loadAssets } = useMediaLibrary();

const mediaItems = useMediaLibrary().assets;
const recentUploads = ref<MediaItem[]>([]);

onMounted(() => {
	loadAssets();
	recentUploads.value = mediaItems.value.slice(0, 6);
});

const handleUpload = async (files: File[]) => {
	for (const file of files) {
		try {
			await uploadFile(file);
		} catch (err) {
			console.error("Failed to upload file:", err);
		}
	}
	await loadAssets();
	recentUploads.value = mediaItems.value.slice(0, 6);
};

const handleSelect = (media: MediaItem) => {
	console.log("Selected:", media);
};

const handlePreview = (media: MediaItem) => {
	console.log("Preview:", media);
};

const handleDownload = (media: MediaItem) => {
	const link = document.createElement("a");
	link.href = media.url;
	link.download = media.name;
	link.click();
};

const handleDelete = async (media: MediaItem) => {
	if (confirm(`Are you sure you want to delete "${media.name}"?`)) {
		try {
			await $fetch(`/api/assets/${media.id}`, {
				method: "DELETE",
			});
			await loadAssets();
			recentUploads.value = mediaItems.value.slice(0, 6);
		} catch (err) {
			console.error("Failed to delete media:", err);
		}
	}
};
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="mb-8">
				<NuxtLink
					to="/media"
					class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
				>
					<i class="i-mdi-arrow-left mr-1" />
					Back to Media Library
				</NuxtLink>
				<h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
					Upload Media
				</h1>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Upload images, audio, or video files
				</p>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<MediaUpload
					:recent-uploads="recentUploads"
					@select="handleSelect"
					@preview="handlePreview"
					@download="handleDownload"
					@delete="handleDelete"
					@upload="handleUpload"
				/>
			</div>
		</div>
	</div>
</template>
