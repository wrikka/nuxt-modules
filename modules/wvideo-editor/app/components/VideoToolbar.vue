<script setup lang="ts">
import { useVideoEditor } from "~/composables/useVideoEditor";
import { useVideoStore } from "~/stores/video";

const {
	isPlaying,
	selectedClipId,
	togglePlayback,
	stopPlayback,
	stepBackward,
	stepForward,
	addVideoTrack,
	addAudioTrack,
	addTextTrack,
	deleteSelectedClip,
	splitSelectedClip,
	duplicateSelectedClip,
} = useVideoEditor();

const videoStore = useVideoStore();

const saveProject = async () => {
	await videoStore.saveProject();
};

const isExporting = ref(false);

const exportVideo = async () => {
	if (!videoStore.currentVideoProject) return;
	isExporting.value = true;
	try {
		const response = await $fetch(
			`/api/video-projects/${videoStore.currentVideoProject.id}/export`,
			{
				method: "POST",
				body: {
					resolution: "1080p",
					quality: "high",
					format: "mp4",
				},
			},
		);
		alert(`Export successful! Download here: ${response.data.url}`);
	} catch (error) {
		console.error("Export failed:", error);
		alert("Export failed. Please check the console for details.");
	} finally {
		isExporting.value = false;
	}
};
</script>

<template>
	<div class="h-12 bg-gray-900 border-b border-gray-700 flex items-center px-4 gap-2">
		<button
			class="p-2 rounded hover:bg-gray-800 text-white"
			:title="isPlaying ? 'Pause' : 'Play'"
			@click="togglePlayback"
		>
			{{ isPlaying ? "⏸️" : "▶️" }}
		</button>

		<button
			class="p-2 rounded hover:bg-gray-800 text-white"
			title="Stop"
			@click="stopPlayback"
		>
			⏹️
		</button>

		<button
			class="p-2 rounded hover:bg-gray-800 text-white"
			title="Step Backward"
			@click="stepBackward"
		>
			⏮️
		</button>

		<button
			class="p-2 rounded hover:bg-gray-800 text-white"
			title="Step Forward"
			@click="stepForward"
		>
			⏭️
		</button>

		<div class="w-px h-6 bg-gray-700 mx-2" />

		<button
			class="p-2 rounded hover:bg-gray-800 text-white"
			title="Add Video Track"
			@click="addVideoTrack"
		>
			📹
		</button>

		<button
			class="p-2 rounded hover:bg-gray-800 text-white"
			title="Add Audio Track"
			@click="addAudioTrack"
		>
			🎵
		</button>

		<button
			class="p-2 rounded hover:bg-gray-800 text-white"
			title="Add Text Track"
			@click="addTextTrack"
		>
			📝
		</button>

		<div class="w-px h-6 bg-gray-700 mx-2" />

		<button
			class="p-2 rounded hover:bg-gray-800 text-white"
			title="Delete Selected Clip"
			:disabled="!selectedClipId"
			@click="deleteSelectedClip"
		>
			🗑️
		</button>

		<button
			class="p-2 rounded hover:bg-gray-800 text-white"
			title="Split Clip"
			:disabled="!selectedClipId"
			@click="splitSelectedClip"
		>
			✂️
		</button>

		<button
			class="p-2 rounded hover:bg-gray-800 text-white"
			title="Duplicate Clip"
			:disabled="!selectedClipId"
			@click="duplicateSelectedClip"
		>
			📋
		</button>

		<div class="flex-1" />

		<button
			class="p-2 rounded hover:bg-gray-800 text-white"
			title="Save Project"
			@click="saveProject"
		>
			💾
		</button>

		<button
			class="p-2 rounded hover:bg-gray-800 text-white disabled:text-gray-500 disabled:cursor-not-allowed"
			title="Export Video"
			@click="exportVideo"
			:disabled="isExporting"
		>
			<span v-if="isExporting" class="animate-spin">⚙️</span>
			<span v-else>📤</span>
		</button>
	</div>
</template>
