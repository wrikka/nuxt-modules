<script setup lang="ts">
import type { MediaItem } from "#shared/types/media";
import { ref } from "vue";

const props = defineProps<{
	media: MediaItem;
}>();

defineEmits<{
	download: [];
	delete: [];
}>();

const showPreview = ref(false);
const mediaTags = ref<string[]>(props.media.tags || []);

const updateTags = (tags: string[]) => {
	mediaTags.value = tags;
};

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

const formatDate = (date: Date): string => {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};
</script>

<template>
	<div class="media-detail">
		<div class="mb-6 flex items-start justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
					{{ media.name }}
				</h1>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					{{ media.mimeType }}
				</p>
			</div>
			<div class="flex gap-2">
				<button
					@click="showPreview = true"
					class="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
				>
					<i class="i-mdi-eye mr-2" />
					Preview
				</button>
				<button
					@click="$emit('download')"
					class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				>
					<i class="i-mdi-download mr-2" />
					Download
				</button>
				<button
					@click="$emit('delete')"
					class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
				>
					<i class="i-mdi-delete mr-2" />
					Delete
				</button>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
					Preview
				</h2>
				<div class="aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
					<img
						v-if="media.type === 'image'"
						:src="media.url"
						:alt="media.name"
						class="h-full w-full object-contain"
					/>
					<video
						v-else-if="media.type === 'video'"
						:src="media.url"
						controls
						class="h-full w-full"
					/>
					<audio
						v-else-if="media.type === 'audio'"
						:src="media.url"
						controls
						class="w-full"
					/>
					<div v-else class="flex h-full items-center justify-center">
						<i class="i-mdi-file text-6xl text-gray-400" />
					</div>
				</div>
			</div>

			<div class="space-y-6">
				<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
					<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						Details
					</h2>
					<dl class="space-y-3">
						<div class="flex justify-between">
							<dt class="text-sm text-gray-600 dark:text-gray-400">Type</dt>
							<dd class="text-sm font-medium text-gray-900 dark:text-white capitalize">
								{{ media.type }}
							</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm text-gray-600 dark:text-gray-400">Size</dt>
							<dd class="text-sm font-medium text-gray-900 dark:text-white">
								{{ formatFileSize(media.size) }}
							</dd>
						</div>
						<div v-if="media.duration" class="flex justify-between">
							<dt class="text-sm text-gray-600 dark:text-gray-400">Duration</dt>
							<dd class="text-sm font-medium text-gray-900 dark:text-white">
								{{ formatDuration(media.duration) }}
							</dd>
						</div>
						<div
							v-if="media.width && media.height"
							class="flex justify-between"
						>
							<dt class="text-sm text-gray-600 dark:text-gray-400">
								Dimensions
							</dt>
							<dd class="text-sm font-medium text-gray-900 dark:text-white">
								{{ media.width }} × {{ media.height }} px
							</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm text-gray-600 dark:text-gray-400">Created</dt>
							<dd class="text-sm font-medium text-gray-900 dark:text-white">
								{{ formatDate(media.createdAt) }}
							</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm text-gray-600 dark:text-gray-400">Updated</dt>
							<dd class="text-sm font-medium text-gray-900 dark:text-white">
								{{ formatDate(media.updatedAt) }}
							</dd>
						</div>
					</dl>
				</div>

				<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
					<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						Tags
					</h2>
					<TagManager :tags="mediaTags" @update="updateTags" />
				</div>

				<div
					v-if="media.metadata"
					class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
				>
					<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						Metadata
					</h2>
					<dl class="space-y-2">
						<div
							v-for="(value, key) in media.metadata"
							:key="key"
							class="flex justify-between"
						>
							<dt class="text-sm text-gray-600 dark:text-gray-400 capitalize">
								{{ key }}
							</dt>
							<dd class="text-sm font-medium text-gray-900 dark:text-white">
								{{ String(value) }}
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>

		<PreviewModal
			v-if="showPreview"
			:media="media"
			@close="showPreview = false"
		/>
	</div>
</template>
