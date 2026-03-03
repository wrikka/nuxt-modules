<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const recordingState = ref<"idle" | "countdown" | "recording" | "paused">(
	"idle",
);
const countdown = ref(3);
const duration = ref(0);
const settings = reactive({
	resolution: "1080p",
	fps: 30,
	showWebcam: true,
	webcamPosition: "bottom-right",
	recordAudio: true,
});

const resolutions = ["720p", "1080p", "4K"];
const positions = ["top-left", "top-right", "bottom-left", "bottom-right"];

let timer: ReturnType<typeof setInterval> | null = null;

const startRecording = () => {
	recordingState.value = "countdown";
	countdown.value = 3;
	const cdInterval = setInterval(() => {
		countdown.value--;
		if (countdown.value <= 0) {
			clearInterval(cdInterval);
			recordingState.value = "recording";
			duration.value = 0;
			timer = setInterval(() => duration.value++, 1000);
		}
	}, 1000);
};

const stopRecording = () => {
	if (timer) clearInterval(timer);
	recordingState.value = "idle";
	duration.value = 0;
};

const pauseRecording = () => {
	if (timer) clearInterval(timer);
	recordingState.value = "paused";
};

const resumeRecording = () => {
	recordingState.value = "recording";
	timer = setInterval(() => duration.value++, 1000);
};

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, "0")}:${
		secs.toString().padStart(2, "0")
	}`;
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Screen Recording Studio"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<!-- Preview Area -->
			<div class="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
				<!-- Screen Preview -->
				<div class="absolute inset-0 flex items-center justify-center">
					<Icon name="mdi:monitor" class="w-16 h-16 text-gray-700" />
				</div>
				<!-- Webcam PIP -->
				<div
					v-if="settings.showWebcam"
					class="absolute w-32 h-24 bg-gray-800 rounded-lg border-2 border-gray-700 flex items-center justify-center"
					:class="{
						'top-2 left-2': settings.webcamPosition === 'top-left',
						'top-2 right-2': settings.webcamPosition === 'top-right',
						'bottom-2 left-2': settings.webcamPosition === 'bottom-left',
						'bottom-2 right-2': settings.webcamPosition === 'bottom-right',
					}"
				>
					<Icon name="mdi:account" class="w-8 h-8 text-gray-600" />
				</div>
				<!-- Recording Indicator -->
				<div
					v-if="recordingState === 'recording'"
					class="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-red-500/90 rounded-full"
				>
					<div class="w-2 h-2 bg-white rounded-full animate-pulse" />
					<span class="text-white text-sm font-medium">REC {{
							formatTime(duration)
						}}</span>
				</div>
				<!-- Countdown -->
				<div
					v-if="recordingState === 'countdown'"
					class="absolute inset-0 flex items-center justify-center bg-black/50"
				>
					<span class="text-6xl font-bold text-white">{{ countdown }}</span>
				</div>
				<!-- Paused -->
				<div
					v-if="recordingState === 'paused'"
					class="absolute inset-0 flex items-center justify-center bg-black/50"
				>
					<Icon name="mdi:pause" class="w-16 h-16 text-white" />
				</div>
			</div>

			<!-- Settings -->
			<div class="space-y-3">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>Resolution</label>
						<select
							v-model="settings.resolution"
							class="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
						>
							<option v-for="r in resolutions" :key="r" :value="r">
								{{ r }}
							</option>
						</select>
					</div>
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>FPS</label>
						<select
							v-model="settings.fps"
							class="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
						>
							<option :value="30">30 FPS</option>
							<option :value="60">60 FPS</option>
						</select>
					</div>
				</div>
				<div class="flex items-center gap-4">
					<label class="flex items-center gap-2">
						<input
							v-model="settings.showWebcam"
							type="checkbox"
							class="rounded"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300"
						>Show Webcam</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							v-model="settings.recordAudio"
							type="checkbox"
							class="rounded"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300"
						>Record Audio</span>
					</label>
				</div>
			</div>

			<!-- Controls -->
			<div class="flex gap-3">
				<button
					v-if="recordingState === 'idle'"
					class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
					@click="startRecording"
				>
					<Icon name="mdi:record" class="w-5 h-5 inline mr-2" />
					Start Recording
				</button>
				<template v-else-if="recordingState === 'recording'">
					<button
						class="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
						@click="pauseRecording"
					>
						<Icon name="mdi:pause" class="w-5 h-5 inline mr-2" />
						Pause
					</button>
					<button
						class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
						@click="stopRecording"
					>
						<Icon name="mdi:stop" class="w-5 h-5 inline mr-2" />
						Stop
					</button>
				</template>
				<button
					v-else-if="recordingState === 'paused'"
					class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
					@click="resumeRecording"
				>
					<Icon name="mdi:play" class="w-5 h-5 inline mr-2" />
					Resume
				</button>
			</div>
		</div>
	</ModalDialog>
</template>
