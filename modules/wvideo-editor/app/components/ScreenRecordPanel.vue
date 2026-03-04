<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	startRecording: [settings: RecordingSettings];
	stopRecording: [];
}>();

interface RecordingSettings {
	audio: boolean;
	video: boolean;
	resolution: "1080p" | "720p" | "480p";
	fps: 30 | 60;
	countdown: number;
}

const settings = ref<RecordingSettings>({
	audio: true,
	video: true,
	resolution: "1080p",
	fps: 30,
	countdown: 3,
});

const isRecording = ref(false);
const recordingTime = ref(0);
const countdown = ref(0);
const isCountingDown = ref(false);
let timerInterval: NodeJS.Timeout | null = null;

const devices = ref([
	{ id: "screen", name: "Entire Screen", type: "screen" },
	{ id: "window", name: "Application Window", type: "window" },
	{ id: "camera", name: "Camera Only", type: "camera" },
]);

const selectedDevice = ref("screen");

const startRecording = () => {
	if (settings.value.countdown > 0) {
		isCountingDown.value = true;
		countdown.value = settings.value.countdown;

		const countInterval = setInterval(() => {
			countdown.value--;
			if (countdown.value <= 0) {
				clearInterval(countInterval);
				isCountingDown.value = false;
				beginRecording();
			}
		}, 1000);
	} else {
		beginRecording();
	}
};

const beginRecording = () => {
	isRecording.value = true;
	recordingTime.value = 0;
	emit("startRecording", settings.value);

	timerInterval = setInterval(() => {
		recordingTime.value++;
	}, 1000);
};

const stopRecording = () => {
	isRecording.value = false;
	if (timerInterval) {
		clearInterval(timerInterval);
		timerInterval = null;
	}
	emit("stopRecording");
};

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, "0")}:${
		secs.toString().padStart(2, "0")
	}`;
};

onUnmounted(() => {
	if (timerInterval) {
		clearInterval(timerInterval);
	}
});
</script>

<template>
	<div class="screen-record-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[380px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:circle" class="w-5 h-5 text-blue-500" />
				Screen Recording
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Recording Source -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Recording Source</label>
			<div class="space-y-1">
				<button
					v-for="device in devices"
					:key="device.id"
					class="w-full flex items-center gap-3 p-2 rounded-lg transition-colors"
					:class="selectedDevice === device.id
					? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
					: 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700'"
					@click="selectedDevice = device.id"
				>
					<Icon
						:name="device.type === 'screen'
						? 'mdi:monitor'
						: device.type === 'window'
						? 'mdi:application'
						: 'mdi:camera'"
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
					/>
					<span class="text-gray-900 dark:text-white text-sm">{{
						device.name
					}}</span>
					<Icon
						v-if="selectedDevice === device.id"
						name="mdi:check-circle"
						class="w-4 h-4 text-blue-500 ml-auto"
					/>
				</button>
			</div>
		</div>

		<!-- Settings -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Settings</label>
			<div class="grid grid-cols-2 gap-2 mb-2">
				<select
					v-model="settings.resolution"
					class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
					:disabled="isRecording"
				>
					<option value="1080p">1080p HD</option>
					<option value="720p">720p</option>
					<option value="480p">480p</option>
				</select>
				<select
					v-model="settings.fps"
					class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
					:disabled="isRecording"
				>
					<option :value="30">30 FPS</option>
					<option :value="60">60 FPS</option>
				</select>
			</div>
			<div class="flex items-center gap-4">
				<label
					class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
				>
					<input
						v-model="settings.audio"
						type="checkbox"
						class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
						:disabled="isRecording"
					>
					Record Audio
				</label>
				<label
					class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
				>
					<input
						v-model="settings.video"
						type="checkbox"
						class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
						:disabled="isRecording"
					>
					Record Video
				</label>
			</div>
		</div>

		<!-- Countdown Setting -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm"
				>Countdown</label>
				<span class="text-blue-500 text-sm">{{ settings.countdown }}s</span>
			</div>
			<input
				v-model="settings.countdown"
				type="range"
				min="0"
				max="10"
				step="1"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
				:disabled="isRecording"
			>
		</div>

		<!-- Recording Timer -->
		<div
			v-if="isRecording || isCountingDown"
			class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600/30 rounded-lg text-center"
		>
			<div v-if="isCountingDown" class="text-4xl font-bold text-red-500">
				{{ countdown }}
			</div>
			<div v-else class="flex items-center justify-center gap-2">
				<div class="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
				<span class="text-2xl font-mono text-red-500">{{
					formatTime(recordingTime)
				}}</span>
			</div>
		</div>

		<!-- Recording Controls -->
		<div class="flex gap-2">
			<button
				v-if="!isRecording && !isCountingDown"
				class="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
				@click="startRecording"
			>
				<Icon name="mdi:circle" class="w-5 h-5" />
				Start Recording
			</button>
			<button
				v-else-if="isRecording"
				class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
				@click="stopRecording"
			>
				<Icon name="mdi:stop" class="w-5 h-5" />
				Stop Recording
			</button>
			<button
				v-else-if="isCountingDown"
				class="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
				disabled
			>
				<Icon name="mdi:timer-sand" class="w-5 h-5 animate-spin" />
				Starting...
			</button>
		</div>

		<!-- Info -->
		<div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700/30 rounded-lg text-xs text-gray-500 dark:text-gray-400">
			<p>Recording will be saved directly to your project media bin.</p>
		</div>
	</div>
</template>
