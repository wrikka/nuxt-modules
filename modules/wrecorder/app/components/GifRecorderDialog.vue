<script setup lang="ts">
const isOpen = defineModel<boolean>("isOpen", { default: false });

const { isRecording, isPaused, currentRecording, recordings, startRecording, pauseRecording, resumeRecording, stopRecording, downloadGif, deleteRecording, clearRecordings } = useGifRecording();

const fps = ref(10);
const quality = ref(50);
const maxDuration = ref(30);
const recordingDuration = ref(0);
let durationInterval: NodeJS.Timeout | null = null;

const startGifRecording = async () => {
	recordingDuration.value = 0;
	await startRecording({ fps: fps.value, quality: quality.value });

	durationInterval = setInterval(() => {
		recordingDuration.value++;
		if (recordingDuration.value >= maxDuration.value) {
			void stopGifRecording();
		}
	}, 1000);
};

const stopGifRecording = async () => {
	if (durationInterval) {
		clearInterval(durationInterval);
		durationInterval = null;
	}
	await stopRecording();
};

const togglePause = () => {
	if (isPaused.value) {
		resumeRecording();
	} else {
		pauseRecording();
	}
};

const formatDuration = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const formatFileSize = (bytes: number): string => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

onUnmounted(() => {
	if (durationInterval) {
		clearInterval(durationInterval);
	}
});
</script>

<template>
	<ModalDialog v-model:is-open="isOpen" title="GIF Recorder" max-width="700px">
		<div class="space-y-4">
			<!-- Settings -->
			<div v-if="!isRecording && !currentRecording" class="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">FPS</label>
					<select v-model.number="fps" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
						<option :value="5">5 FPS</option>
						<option :value="10">10 FPS</option>
						<option :value="15">15 FPS</option>
						<option :value="20">20 FPS</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Duration</label>
					<select v-model.number="maxDuration" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
						<option :value="5">5 sec</option>
						<option :value="10">10 sec</option>
						<option :value="15">15 sec</option>
						<option :value="30">30 sec</option>
						<option :value="60">60 sec</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quality</label>
					<select v-model.number="quality" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
						<option :value="30">Low (Small)</option>
						<option :value="50">Medium</option>
						<option :value="80">High (Large)</option>
					</select>
				</div>
			</div>

			<!-- Recording Controls -->
			<div v-if="isRecording || currentRecording" class="flex items-center justify-center gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
				<template v-if="isRecording">
					<div class="flex items-center gap-3">
						<div class="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
						<span class="text-lg font-mono text-gray-900 dark:text-white">{{ formatDuration(recordingDuration) }}</span>
						<span class="text-sm text-gray-500">/ {{ maxDuration }}s</span>
					</div>
					<button
						class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium flex items-center gap-2"
						@click="togglePause"
					>
						<Icon :name="isPaused ? 'mdi:play' : 'mdi:pause'" class="w-5 h-5" />
						{{ isPaused ? 'Resume' : 'Pause' }}
					</button>
					<button
						class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center gap-2"
						@click="stopGifRecording"
					>
						<Icon name="mdi:stop" class="w-5 h-5" />
						Stop
					</button>
				</template>
			</div>

			<!-- Start Button -->
			<button
				v-if="!isRecording && !currentRecording"
				class="w-full px-4 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
				@click="startGifRecording"
			>
				<Icon name="mdi:record-circle" class="w-6 h-6" />
				Start GIF Recording
			</button>

			<!-- Preview -->
			<div v-if="currentRecording && !isRecording" class="border rounded-lg p-4 dark:border-gray-700">
				<div class="flex items-center justify-between mb-3">
					<h3 class="font-medium text-gray-900 dark:text-white">GIF Preview</h3>
					<div class="flex gap-2">
						<span class="text-sm text-gray-500">{{ currentRecording.frameCount }} frames</span>
						<span class="text-sm text-gray-500">{{ formatDuration(currentRecording.duration) }}</span>
					</div>
				</div>
				<img
					:src="currentRecording.url"
					alt="GIF Preview"
					class="w-full max-h-64 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
				/>
				<div class="mt-3 flex gap-2">
					<button
						class="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
						@click="downloadGif(currentRecording)"
					>
						<Icon name="mdi:download" class="w-5 h-5" />
						Download GIF
					</button>
					<button
						class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
						@click="deleteRecording(currentRecording.id); currentRecording = null"
					>
						<Icon name="mdi:delete" class="w-5 h-5" />
					</button>
				</div>
				<div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
					Size: {{ formatFileSize(currentRecording.blob.size) }}
				</div>
			</div>

			<!-- Tips -->
			<div v-if="!isRecording && !currentRecording" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
					<div class="text-sm text-blue-700 dark:text-blue-300">
						<p class="font-medium mb-1">Tips for best GIFs:</p>
						<ul class="list-disc list-inside space-y-0.5">
							<li>Use 10-15 FPS for smooth animations</li>
							<li>Keep duration under 15 seconds for smaller file size</li>
							<li>Lower quality = smaller file but less detail</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</ModalDialog>
</template>
