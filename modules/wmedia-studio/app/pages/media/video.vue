<script setup lang="ts">
import type { MediaItem } from "#shared/types/media";

const { assets: mediaItems, loading, error, loadAssets } = useMediaLibrary();

const videos = computed(() =>
	mediaItems.value.filter((m) => m.type === "video")
);

onMounted(() => {
	loadAssets();
});

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
		} catch (err) {
			console.error("Failed to delete media:", err);
		}
	}
};
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="mb-8 flex items-center justify-between">
				<div>
					<NuxtLink
						to="/media"
						class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
					>
						<i class="i-mdi-arrow-left mr-1" />
						Back to Media Library
					</NuxtLink>
					<h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
						Videos
					</h1>
					<p class="mt-2 text-gray-600 dark:text-gray-400">
						Manage your video files
					</p>
				</div>
				<NuxtLink
					to="/media/upload"
					class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				>
					<i class="i-mdi-upload mr-2" />
					Upload Videos
				</NuxtLink>
			</div>

			<MediaList
				:media-items="videos"
				:loading="loading"
				:error="error"
				@select="handleSelect"
				@preview="handlePreview"
				@download="handleDownload"
				@delete="handleDelete"
			/>
		</div>
	</div>
</template>
