<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	startRecording: [];
	stopRecording: [];
	addToTimeline: [audioBlob: Blob];
}>();

const isRecording = ref(false);
const isPaused = ref(false);
const recordingTime = ref(0);
const audioLevel = ref(0);
const deviceEnabled = ref({ audio: true, video: false });

let timerInterval: NodeJS.Timeout | null = null;
let levelInterval: NodeJS.Timeout | null = null;

const startRecording = () => {
	isRecording.value = true;
	isPaused.value = false;
	recordingTime.value = 0;

	timerInterval = setInterval(() => {
		if (!isPaused.value) {
			recordingTime.value++;
		}
	}, 1000);

	// Simulate audio level
	levelInterval = setInterval(() => {
		if (!isPaused.value) {
			audioLevel.value = 20 + Math.random() * 60;
		}
	}, 100);

	emit("startRecording");
};

const pauseRecording = () => {
	isPaused.value = !isPaused.value;
};

const stopRecording = () => {
	isRecording.value = false;
	isPaused.value = false;
	if (timerInterval) clearInterval(timerInterval);
	if (levelInterval) clearInterval(levelInterval);
	emit("stopRecording");
};

const addToTimeline = () => {
	// Simulate adding a dummy blob
	emit("addToTimeline", new Blob([], { type: "audio/wav" }));
};

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

onUnmounted(() => {
	if (timerInterval) clearInterval(timerInterval);
	if (levelInterval) clearInterval(levelInterval);
});
</script>

<template>
	<div class="voice-over-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[380px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:microphone" class="w-5 h-5 text-blue-500" />
				Voice Over Recording
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Input Device -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Input Device</label>
			<select class="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0">
				<option>Default Microphone</option>
				<option>USB Microphone</option>
				<option>Headset Microphone</option>
			</select>
		</div>

		<!-- Recording Timer -->
		<div class="mb-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-center">
			<div
				class="text-3xl font-mono font-bold mb-2"
				:class="isRecording
				? (isPaused ? 'text-yellow-500' : 'text-red-500')
				: 'text-gray-400'"
			>
				{{ formatTime(recordingTime) }}
			</div>
			<div class="flex items-center justify-center gap-2">
				<div
					class="w-3 h-3 rounded-full"
					:class="isRecording && !isPaused
					? 'bg-red-500 animate-pulse'
					: 'bg-gray-400'"
				/>
				<span class="text-gray-500 dark:text-gray-400 text-sm">
					{{ isRecording ? (isPaused ? "Paused" : "Recording...") : "Ready" }}
				</span>
			</div>
		</div>

		<!-- Audio Level Meter -->
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
			>Input Level</label>
			<div class="h-8 bg-gray-200 dark:bg-gray-900 rounded-lg flex items-center px-1 gap-px">
				<div
					v-for="i in 30"
					:key="i"
					class="flex-1 h-6 rounded-sm transition-all duration-75"
					:class="i <= (audioLevel / 100) * 30
					? i > 25 ? 'bg-red-500' : i > 20 ? 'bg-yellow-500' : 'bg-green-500'
					: 'bg-gray-300 dark:bg-gray-700'"
				/>
			</div>
			<div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
				<span>-60dB</span>
				<span>-30dB</span>
				<span>-12dB</span>
				<span>0dB</span>
			</div>
		</div>

		<!-- Recording Controls -->
		<div class="flex justify-center gap-3 mb-4">
			<button
				v-if="!isRecording"
				class="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center justify-center"
				@click="startRecording"
			>
				<Icon name="mdi:circle" class="w-6 h-6" />
			</button>

			<template v-else>
				<button
					class="w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white transition-colors flex items-center justify-center"
					@click="pauseRecording"
				>
					<Icon :name="isPaused ? 'mdi:play' : 'mdi:pause'" class="w-6 h-6" />
				</button>
				<button
					class="w-14 h-14 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors flex items-center justify-center"
					@click="stopRecording"
				>
					<Icon name="mdi:stop" class="w-6 h-6" />
				</button>
			</template>
		</div>

		<!-- Options -->
		<div class="flex gap-4 mb-4 justify-center">
			<label
				class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
			>
				<input
					v-model="deviceEnabled.audio"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				>
				Audio
			</label>
			<label
				class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
			>
				<input
					v-model="deviceEnabled.video"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				>
				Video
			</label>
		</div>

		<!-- Add to Timeline -->
		<button
			v-if="!isRecording && recordingTime > 0"
			class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
			@click="addToTimeline"
		>
			<Icon name="mdi:plus" class="w-4 h-4" />
			Add to Timeline
		</button>

		<!-- Tips -->
		<div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
			<div class="flex items-start gap-2">
				<Icon name="mdi:lightbulb" class="w-4 h-4 text-blue-500 mt-0.5" />
				<p class="text-blue-600 dark:text-blue-300 text-xs">
					Tip: Keep your audio levels in the green zone for best quality. Avoid
					clipping (red).
				</p>
			</div>
		</div>
	</div>
</template>
