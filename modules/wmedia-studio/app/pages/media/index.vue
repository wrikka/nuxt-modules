<script setup lang="ts">
import type { MediaItem } from "#shared/types/media";

const {
	assets: mediaItems,
	loading,
	error,
	loadAssets,
	formatFileSize,
	formatDuration,
} = useMediaLibrary();

const filter = ref<"all" | "image" | "audio" | "video">("all");
const searchQuery = ref("");

const filteredMedia = computed(() => {
	let filtered = mediaItems.value;
	if (filter.value !== "all") {
		filtered = filtered.filter((m) => m.type === filter.value);
	}
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		filtered = filtered.filter((m) =>
			m.name.toLowerCase().includes(query)
			|| m.tags?.some((tag) => tag.toLowerCase().includes(query))
		);
	}
	return filtered;
});

onMounted(() => {
	loadAssets();
});

const filterByType = (type: "all" | "image" | "audio" | "video") => {
	filter.value = type;
};

const handleSearch = () => {
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
		} catch (err) {
			console.error("Failed to delete media:", err);
		}
	}
};
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="flex gap-6">
				<aside class="hidden w-64 flex-shrink-0 lg:block">
					<div class="sticky top-8 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
						<FolderTree />
					</div>
				</aside>

				<div class="flex-1">
					<div class="mb-8 flex items-center justify-between">
						<div>
							<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
								Media Library
							</h1>
							<p class="mt-2 text-gray-600 dark:text-gray-400">
								Manage your images, audio, and video files
							</p>
						</div>
						<NuxtLink
							to="/media/upload"
							class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						>
							<i class="i-mdi-upload mr-2" />
							Upload
						</NuxtLink>
					</div>

					<div class="mb-6 flex gap-2">
						<button
							@click="filterByType('all')"
							:class="filter === 'all'
							? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
							: 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'"
							class="rounded-md px-4 py-2 text-sm font-medium"
						>
							All
						</button>
						<button
							@click="filterByType('image')"
							:class="filter === 'image'
							? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
							: 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'"
							class="rounded-md px-4 py-2 text-sm font-medium"
						>
							Images
						</button>
						<button
							@click="filterByType('audio')"
							:class="filter === 'audio'
							? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
							: 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'"
							class="rounded-md px-4 py-2 text-sm font-medium"
						>
							Audio
						</button>
						<button
							@click="filterByType('video')"
							:class="filter === 'video'
							? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
							: 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'"
							class="rounded-md px-4 py-2 text-sm font-medium"
						>
							Videos
						</button>
					</div>

					<div class="mb-6">
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Search media..."
							class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							@input="handleSearch"
						/>
					</div>

					<MediaList
						:media-items="filteredMedia"
						:loading="loading"
						:error="error"
						@select="handleSelect"
						@preview="handlePreview"
						@download="handleDownload"
						@delete="handleDelete"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
