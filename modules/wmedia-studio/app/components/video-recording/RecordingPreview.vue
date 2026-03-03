<script setup lang="ts">
import { useElementSize } from "@vueuse/core";
import AudioLevelMeter from "./AudioLevelMeter.vue";

const props = defineProps<{
	stream: MediaStream;
	isRecording: boolean;
	isCountingDown?: boolean;
	countdownValue?: number;
	recordingTime: number;
	virtualBackgroundEnabled?: boolean;
	virtualBackgroundType?: "blur" | "color" | "image";
	blurAmount?: number;
	backgroundColor?: string;
	backgroundImage?: string;
}>();

const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const { width, height } = useElementSize(videoRef);
const { applyVirtualBackground } = useVirtualBackground();

const updateVirtualBackground = () => {
	if (videoRef.value && canvasRef.value && props.virtualBackgroundEnabled) {
		applyVirtualBackground(
			videoRef.value,
			canvasRef.value,
		);
	}
};

watch(
	[
		() => props.virtualBackgroundEnabled,
		() => props.virtualBackgroundType,
		() => props.blurAmount,
		() => props.backgroundColor,
		() => props.backgroundImage,
	],
	() => {
		updateVirtualBackground();
	},
	{ deep: true },
);

const formattedTime = computed(() => {
	const minutes = Math.floor(props.recordingTime / 60);
	const seconds = props.recordingTime % 60;
	return `${minutes.toString().padStart(2, "0")}:${
		seconds.toString().padStart(2, "0")
	}`;
});

const resolution = computed(() => {
	if (videoRef.value) {
		return `${videoRef.value.videoWidth}x${videoRef.value.videoHeight}`;
	}
	return "N/A";
});

watch(
	() => props.stream,
	(newStream) => {
		if (videoRef.value && newStream) {
			videoRef.value.srcObject = newStream;
		}
	},
	{ immediate: true },
);
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
			Preview
		</h2>

		<div class="relative bg-black rounded-lg overflow-hidden aspect-video">
			<video
				ref="videoRef"
				:srcObject="stream"
				autoplay
				muted
				playsinline
				class="w-full h-full object-contain"
			/>

			<canvas
				ref="canvasRef"
				v-if="virtualBackgroundEnabled"
				class="absolute inset-0 w-full h-full object-contain"
				style="pointer-events: none"
				:hidden="!virtualBackgroundEnabled"
			/>

			<div
				v-if="isCountingDown"
				class="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			>
				<div class="text-center">
					<div class="text-9xl font-bold text-white animate-pulse">
						{{ countdownValue }}
					</div>
					<p class="text-white text-xl mt-4">Get ready...</p>
				</div>
			</div>

			<div
				v-if="isRecording"
				class="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1.5 rounded-full"
			>
				<div class="w-3 h-3 bg-white rounded-full animate-pulse" />
				<span class="text-sm font-medium">{{ formattedTime }}</span>
			</div>

			<div
				v-if="isRecording"
				class="absolute top-4 right-4 flex items-center space-x-2 bg-black/50 text-white px-3 py-1.5 rounded-full backdrop-blur-sm"
			>
				<Icon name="mdi:record-rec" class="w-4 h-4 text-red-500" />
				<span class="text-sm font-medium">Recording</span>
			</div>
		</div>

		<div class="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
			<div class="flex items-center space-x-2">
				<Icon name="mdi:video" class="w-4 h-4" />
				<span>Resolution: {{ resolution }}</span>
			</div>
			<div class="flex items-center space-x-2">
				<Icon name="mdi:clock" class="w-4 h-4" />
				<span>Duration: {{ formattedTime }}</span>
			</div>
		</div>

		<div v-if="stream && stream.getAudioTracks().length > 0" class="mt-4">
			<AudioLevelMeter :stream="stream" />
		</div>
	</div>
</template>
