<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	startRecording: [];
	stopRecording: [];
	saveRecording: [blob: Blob];
}>();

const isRecording = ref(false);
const isPaused = ref(false);
const recordingTime = ref(0);
const audioLevel = ref(0);
const recordedBlob = ref<Blob | null>(null);

let timerInterval: NodeJS.Timeout | null = null;
let levelInterval: NodeJS.Timeout | null = null;

const startRecording = async () => {
	isRecording.value = true;
	isPaused.value = false;
	recordingTime.value = 0;

	timerInterval = setInterval(() => {
		if (!isPaused.value) {
			recordingTime.value++;
		}
	}, 1000);

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
	recordedBlob.value = new Blob([], { type: "audio/wav" });
	emit("stopRecording");
};

const saveRecording = () => {
	if (recordedBlob.value) {
		emit("saveRecording", recordedBlob.value);
	}
};

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, "0")}:${
		secs.toString().padStart(2, "0")
	}`;
};

onUnmounted(() => {
	if (timerInterval) clearInterval(timerInterval);
	if (levelInterval) clearInterval(levelInterval);
});
</script>

<template>
	<div class="voice-recorder bg-gray-800 rounded-lg p-4 w-[400px]">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-microphone" class="w-5 h-5" />
				Voice Recorder
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>

		<!-- Timer Display -->
		<div class="text-center mb-6">
			<div
				class="text-4xl font-mono font-bold"
				:class="isRecording ? 'text-red-400' : 'text-gray-400'"
			>
				{{ formatTime(recordingTime) }}
			</div>
			<div class="text-gray-400 text-sm mt-1">
				{{ isRecording ? (isPaused ? "Paused" : "Recording...") : "Ready" }}
			</div>
		</div>

		<!-- Audio Level -->
		<div class="mb-6">
			<div class="flex items-center gap-1 h-12 bg-gray-900 rounded-lg px-2">
				<div
					v-for="i in 20"
					:key="i"
					class="flex-1 rounded-sm transition-all duration-75"
					:class="i <= (audioLevel / 100) * 20
					? i > 16 ? 'bg-red-500' : i > 13 ? 'bg-yellow-500' : 'bg-green-500'
					: 'bg-gray-700'"
					:style="{ height: `${20 + Math.random() * 60}%` }"
				/>
			</div>
		</div>

		<!-- Controls -->
		<div class="flex justify-center gap-3">
			<template v-if="!isRecording">
				<button
					class="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
					@click="startRecording"
				>
					<Icon name="i-ph-record" class="w-8 h-8" />
				</button>
			</template>
			<template v-else>
				<button
					class="w-12 h-12 rounded-full bg-yellow-600 hover:bg-yellow-500 text-white flex items-center justify-center"
					@click="pauseRecording"
				>
					<Icon :name="isPaused ? 'i-ph-play' : 'i-ph-pause'" class="w-5 h-5" />
				</button>
				<button
					class="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 text-white flex items-center justify-center"
					@click="stopRecording"
				>
					<Icon name="i-ph-stop" class="w-5 h-5" />
				</button>
			</template>
		</div>

		<!-- Save Button -->
		<div
			v-if="recordedBlob && !isRecording"
			class="mt-4 pt-4 border-t border-gray-700"
		>
			<button
				class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
				@click="saveRecording"
			>
				<Icon name="i-ph-floppy-disk" class="w-4 h-4 inline mr-2" />
				Save Recording
			</button>
		</div>
	</div>
</template>
