<script setup lang="ts">
import type { VideoSyncInfo } from "#shared/types/audio";

const props = defineProps<{
	audioDuration: number;
}>();

const emit = defineEmits<{
	link: [info: VideoSyncInfo];
	unlink: [];
	seekToVideo: [time: number];
}>();

const videoUrl = ref("");
const isLinked = ref(false);
const videoOffset = ref(0);
const videoFile = ref<File | null>(null);
const thumbnailUrl = ref("");
const videoDuration = ref(0);

const fileInput = ref<HTMLInputElement | null>(null);

const handleVideoImport = () => {
	fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file) {
		videoFile.value = file;
		videoUrl.value = URL.createObjectURL(file);

		// Create thumbnail
		const video = document.createElement("video");
		video.src = videoUrl.value;
		video.onloadedmetadata = () => {
			videoDuration.value = video.duration;
			video.currentTime = 1;
		};
		video.onseeked = () => {
			const canvas = document.createElement("canvas");
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext("2d");
			ctx?.drawImage(video, 0, 0);
			thumbnailUrl.value = canvas.toDataURL();
		};
	}
	target.value = "";
};

const toggleLink = () => {
	isLinked.value = !isLinked.value;
	if (isLinked.value) {
		emit("link", {
			videoUrl: videoUrl.value,
			videoDuration: videoDuration.value,
			linked: true,
			videoOffset: videoOffset.value,
		});
	} else {
		emit("unlink");
	}
};

const syncToVideo = () => {
	if (isLinked.value) {
		emit("seekToVideo", videoOffset.value);
	}
};

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">Video Sync</span>
			<span
				v-if="isLinked"
				class="text-xs text-green-400 flex items-center gap-1"
			>
				<span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
				Linked
			</span>
		</div>

		<!-- Video Upload -->
		<div class="mb-4">
			<input
				ref="fileInput"
				type="file"
				accept="video/*"
				class="hidden"
				@change="handleFileChange"
			>

			<div
				v-if="!videoUrl"
				class="border-2 border-dashed border-gray-700 rounded p-6 text-center"
			>
				<svg
					class="w-10 h-10 text-gray-600 mx-auto mb-2"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1"
						d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
				<p class="text-sm text-gray-500 mb-2">No video loaded</p>
				<button
					@click="handleVideoImport"
					class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
				>
					Import Video
				</button>
			</div>

			<div v-else class="relative rounded overflow-hidden">
				<img
					v-if="thumbnailUrl"
					:src="thumbnailUrl"
					class="w-full h-32 object-cover"
					alt="Video thumbnail"
				>
				<div
					v-else
					class="w-full h-32 bg-gray-800 flex items-center justify-center"
				>
					<svg
						class="w-8 h-8 text-gray-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1"
							d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1"
							d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
				</div>
				<div class="absolute bottom-2 left-2 right-2">
					<p class="text-sm text-white truncate">
						{{ videoFile?.name || "Video" }}
					</p>
					<p class="text-xs text-gray-400">{{ formatTime(videoDuration) }}</p>
				</div>
				<button
					@click='videoUrl = "";
					videoFile = null;
					thumbnailUrl = "";
					isLinked = false;'
					class="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded transition-colors"
				>
					<svg
						class="w-4 h-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Sync Controls -->
		<div v-if="videoUrl" class="space-y-3">
			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Video Offset</span>
					<span class="text-gray-300">{{ videoOffset.toFixed(2) }}s</span>
				</div>
				<input
					v-model.number="videoOffset"
					type="range"
					:min="-props.audioDuration"
					:max="videoDuration"
					step="0.01"
					class="w-full accent-blue-500"
					@input="syncToVideo"
				>
			</div>

			<div class="flex gap-2">
				<button
					@click="toggleLink"
					:class="[
						'flex-1 px-3 py-2 rounded text-sm transition-colors',
						isLinked
							? 'bg-red-600 hover:bg-red-700 text-white'
							: 'bg-green-600 hover:bg-green-700 text-white',
					]"
				>
					{{ isLinked ? "Unlink" : "Link Audio to Video" }}
				</button>
			</div>

			<!-- Info -->
			<div class="bg-gray-800 rounded p-2 text-xs text-gray-500 space-y-1">
				<p>Audio: {{ formatTime(props.audioDuration) }}</p>
				<p>Video: {{ formatTime(videoDuration) }}</p>
				<p v-if="isLinked" class="text-green-400">
					Sync active - audio follows video position
				</p>
			</div>
		</div>
	</div>
</template>
