<script setup lang="ts">
import type { MediaItem } from "#shared/types/media";
import { ref } from "vue";

interface UploadItem {
	file: File;
	status: "pending" | "uploading" | "completed" | "error";
	progress: number;
}

defineProps<{
	recentUploads?: MediaItem[];
}>();

const emit = defineEmits<{
	select: [media: MediaItem];
	preview: [media: MediaItem];
	download: [media: MediaItem];
	delete: [media: MediaItem];
	upload: [files: File[]];
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const uploadQueue = ref<UploadItem[]>([]);

const triggerFileInput = () => {
	fileInputRef.value?.click();
};

const handleFileSelect = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const files = target.files;
	if (files && files.length > 0) {
		processFiles(Array.from(files));
	}
};

const handleDrop = (event: DragEvent) => {
	isDragging.value = false;
	const files = event.dataTransfer?.files;
	if (files && files.length > 0) {
		processFiles(Array.from(files));
	}
};

const processFiles = (files: File[]) => {
	const validFiles = files.filter((file) =>
		file.type.startsWith("image/") || file.type.startsWith("audio/")
		|| file.type.startsWith("video/")
	);
	if (validFiles.length > 0) {
		emit("upload", validFiles);
	}
};

const getFileIcon = (mimeType: string) => {
	if (mimeType.startsWith("image/")) return "i-mdi-image";
	if (mimeType.startsWith("audio/")) return "i-mdi-music";
	if (mimeType.startsWith("video/")) return "i-mdi-video";
	return "i-mdi-file";
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
</script>

<template>
	<div class="media-upload space-y-4">
		<div
			class="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-500"
			:class="{ 'border-blue-500 bg-blue-50 dark:bg-blue-900/20': isDragging }"
			@dragover.prevent="isDragging = true"
			@dragleave.prevent="isDragging = false"
			@drop.prevent="handleDrop"
			@click="triggerFileInput"
		>
			<i class="i-mdi-cloud-upload text-5xl text-gray-400" />
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
				Drag and drop files here, or click to browse
			</p>
			<p class="mt-1 text-xs text-gray-500 dark:text-gray-500">
				Supports images, audio, and video files
			</p>
			<input
				ref="fileInputRef"
				type="file"
				multiple
				accept="image/*,audio/*,video/*"
				class="hidden"
				@change="handleFileSelect"
			/>
		</div>

		<div v-if="uploadQueue.length > 0" class="space-y-2">
			<h3 class="text-sm font-medium text-gray-900 dark:text-white">
				Uploading {{ uploadQueue.length }} file(s)...
			</h3>
			<div
				v-for="(item, index) in uploadQueue"
				:key="index"
				class="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
			>
				<i
					:class="getFileIcon(item.file.type)"
					class="text-2xl text-gray-500"
				/>
				<div class="flex-1 min-w-0">
					<p class="truncate text-sm font-medium text-gray-900 dark:text-white">
						{{ item.file.name }}
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">
						{{ formatFileSize(item.file.size) }}
					</p>
				</div>
				<div v-if="item.status === 'uploading'" class="flex items-center gap-2">
					<i class="i-mdi-loading animate-spin text-blue-500" />
					<span class="text-sm text-gray-500 dark:text-gray-400">{{
							item.progress
						}}%</span>
				</div>
				<i
					v-else-if="item.status === 'completed'"
					class="i-mdi-check-circle text-xl text-green-500"
				/>
				<i
					v-else-if="item.status === 'error'"
					class="i-mdi-alert-circle text-xl text-red-500"
				/>
			</div>
		</div>

		<div v-if="recentUploads && recentUploads.length > 0" class="space-y-2">
			<h3 class="text-sm font-medium text-gray-900 dark:text-white">
				Recent Uploads
			</h3>
			<div class="grid grid-cols-2 gap-2">
				<MediaCard
					v-for="media in recentUploads"
					:key="media.id"
					:media="media"
					@select="$emit('select', $event)"
					@preview="$emit('preview', $event)"
					@download="$emit('download', $event)"
					@delete="$emit('delete', $event)"
				/>
			</div>
		</div>
	</div>
</template>
