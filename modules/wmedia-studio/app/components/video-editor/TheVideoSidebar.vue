<script setup lang="ts">
import { useVideoEditor } from "~/composables/useVideoEditor";

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

const {
	currentVideoProject,
	addVideoClip,
	addImageClip,
	addAudioClip,
	addTextClip,
	selectedClip,
	addTransition,
	removeTransition,
	addMediaAssetToBin,
} = useVideoEditor();

const emit = defineEmits<{
	(e: "toggleMediaBin"): void;
}>();

const showMediaBinPanel = ref(true);
const showTransitionsPanel = ref(false);

const handleAddTextClip = () => {
	if (
		!currentVideoProject.value || currentVideoProject.value.tracks.length === 0
	) return;
	const track = currentVideoProject.value.tracks[0];
	if (!track) return;
	addTextClip(track.id, 0, "Text", 5);
};

const importMedia = () => {
	fileInput.value?.click();
};

const transitionTypes = [
	{ id: "fade", name: "Fade", icon: "🌫️" },
	{ id: "dissolve", name: "Dissolve", icon: "💫" },
];

const handleDragOver = () => {
	isDragging.value = true;
};

const handleDragLeave = () => {
	isDragging.value = false;
};

const handleDrop = async (event: DragEvent) => {
	isDragging.value = false;

	const files = event.dataTransfer?.files;
	if (!files || files.length === 0 || !currentVideoProject.value) return;

	const trackId = currentVideoProject.value.tracks[0]?.id;
	if (!trackId) {
		alert("Please add a track first");
		return;
	}

	for (const file of Array.from(files)) {
		await processFile(file, trackId);
	}
};

const handleFileSelect = async (event: Event) => {
	const target = event.target as HTMLInputElement;
	const files = target.files;
	if (!files || files.length === 0 || !currentVideoProject.value) return;

	const trackId = currentVideoProject.value.tracks[0]?.id;
	if (!trackId) {
		alert("Please add a track first");
		return;
	}

	for (const file of Array.from(files)) {
		await processFile(file, trackId);
	}

	target.value = "";
};

const processFile = async (file: File, trackId?: string) => {
	const fileType = file.type;
	const isVideo = fileType.startsWith("video/");
	const isImage = fileType.startsWith("image/");
	const isAudio = fileType.startsWith("audio/");

	if (!isVideo && !isImage && !isAudio) return;

	// First add to Media Bin
	const assetType = isVideo ? "video" : isImage ? "image" : "audio";
	await addMediaAssetToBin(file, assetType);

	// If trackId provided, also add to timeline
	if (trackId) {
		if (isVideo) {
			await addVideoClip(file, trackId, 0);
		} else if (isImage) {
			await addImageClip(file, trackId, 0);
		} else if (isAudio) {
			await addAudioClip(file, trackId, 0);
		}
	}
};
</script>

<template>
	<aside
		class="w-16 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-4 gap-2"
		@dragover.prevent="handleDragOver"
		@dragleave="handleDragLeave"
		@drop.prevent="handleDrop"
		:class="{ 'border-2 border-blue-500': isDragging }"
	>
		<button
			class="p-3 rounded hover:bg-gray-800 text-white"
			:class="{ 'bg-blue-600': showMediaBinPanel }"
			title="Media Bin"
			@click='showMediaBinPanel = !showMediaBinPanel;
			$emit("toggleMediaBin");'
		>
			📂
		</button>

		<button
			class="p-3 rounded hover:bg-gray-800 text-white"
			title="Import Media"
			@click="importMedia"
		>
			�
		</button>

		<button
			class="p-3 rounded hover:bg-gray-800 text-white"
			title="Templates"
		>
			🎨
		</button>

		<button
			class="p-3 rounded hover:bg-gray-800 text-white"
			title="Effects"
		>
			✨
		</button>

		<button
			class="p-3 rounded hover:bg-gray-800 text-white"
			:class="{ 'bg-blue-600': showTransitionsPanel }"
			title="Transitions"
			@click="showTransitionsPanel = !showTransitionsPanel"
		>
			🔄
		</button>

		<button
			class="p-3 rounded hover:bg-gray-800 text-white"
			title="Text"
			@click="handleAddTextClip"
		>
			📝
		</button>

		<button
			class="p-3 rounded hover:bg-gray-800 text-white"
			title="Shapes"
		>
			⬛
		</button>

		<div class="flex-1" />

		<button
			class="p-3 rounded hover:bg-gray-800 text-white"
			title="Settings"
		>
			⚙️
		</button>

		<div
			v-if="isDragging"
			class="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center pointer-events-none"
		>
			<div class="text-white text-lg font-bold">Drop media files here</div>
		</div>
	</aside>

	<!-- Transitions Panel -->
	<div
		v-if="showTransitionsPanel"
		class="absolute left-16 top-0 w-64 bg-gray-800 border-r border-gray-700 p-4 shadow-lg z-10"
	>
		<h3 class="text-white font-medium mb-3">Transitions</h3>
		<div class="space-y-2">
			<div
				v-for="transition in transitionTypes"
				:key="transition.id"
				class="flex items-center gap-3 p-3 bg-gray-700 rounded cursor-move hover:bg-gray-600 transition-colors"
				draggable="true"
				@dragstart="$event.dataTransfer?.setData('transitionType', transition.id)"
			>
				<span class="text-2xl">{{ transition.icon }}</span>
				<span class="text-white text-sm">{{ transition.name }}</span>
			</div>
		</div>
		<p class="text-gray-400 text-xs mt-4">Drag and drop onto clip edges</p>
	</div>

	<input
		ref="fileInput"
		type="file"
		accept="video/*,image/*,audio/*"
		class="hidden"
		@change="handleFileSelect"
	>
</template>
