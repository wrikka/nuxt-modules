<script setup lang="ts">
import type { Recording } from "~/types";

const props = defineProps<{
	recording: Recording;
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	save: [blob: Blob, name: string];
}>();

const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isProcessing = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const startTime = ref(0);
const endTime = ref(0);
const isPlaying = ref(false);
const zoom = ref(1);
const panX = ref(0);
const isDragging = ref(false);
const dragTarget = ref<"start" | "end" | "playhead" | null>(null);

const waveformData = ref<number[]>([]);

onMounted(() => {
	if (videoRef.value) {
		videoRef.value.src = props.recording.url;
		videoRef.value.addEventListener("loadedmetadata", () => {
			duration.value = videoRef.value?.duration || 0;
			endTime.value = duration.value;
		});
		videoRef.value.addEventListener("timeupdate", () => {
			currentTime.value = videoRef.value?.currentTime || 0;
		});
	}
});

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	const ms = Math.floor((seconds % 1) * 100);
	return `${mins}:${secs.toString().padStart(2, "0")}.${
		ms.toString().padStart(2, "0")
	}`;
};

const play = () => {
	if (videoRef.value) {
		videoRef.value.play();
		isPlaying.value = true;
	}
};

const pause = () => {
	if (videoRef.value) {
		videoRef.value.pause();
		isPlaying.value = false;
	}
};

const seekTo = (time: number) => {
	if (videoRef.value) {
		videoRef.value.currentTime = Math.max(
			startTime.value,
			Math.min(endTime.value, time),
		);
	}
};

const setStartToCurrent = () => {
	startTime.value = currentTime.value;
	if (startTime.value >= endTime.value) {
		endTime.value = Math.min(duration.value, startTime.value + 1);
	}
};

const setEndToCurrent = () => {
	endTime.value = currentTime.value;
	if (endTime.value <= startTime.value) {
		startTime.value = Math.max(0, endTime.value - 1);
	}
};

const handleTrim = async () => {
	if (!videoRef.value || !canvasRef.value) return;

	isProcessing.value = true;
	const video = videoRef.value;
	const canvas = canvasRef.value;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;

	const stream = canvas.captureStream(30);
	const mediaRecorder = new MediaRecorder(stream, {
		mimeType: "video/webm;codecs=vp9",
	});

	const chunks: Blob[] = [];
	mediaRecorder.ondataavailable = (e) => {
		if (e.data.size > 0) chunks.push(e.data);
	};

	mediaRecorder.onstop = () => {
		const blob = new Blob(chunks, { type: "video/webm" });
		emit("save", blob, `${props.recording.name}_trimmed`);
		isProcessing.value = false;
	};

	video.currentTime = startTime.value;
	await new Promise((resolve) => {
		video.onseeked = resolve;
	});

	mediaRecorder.start(100);
	video.play();

	const drawFrame = () => {
		if (video.currentTime >= endTime.value) {
			video.pause();
			mediaRecorder.stop();
			return;
		}
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		requestAnimationFrame(drawFrame);
	};
	drawFrame();
};

const timelineWidth = computed(() => 100 * zoom.value);
const timelineOffset = computed(() => {
	const playheadPos = (currentTime.value / duration.value) * 100 * zoom.value;
	return Math.max(0, playheadPos - 50);
});
</script>

<template>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" class="relative z-50" @close="emit('close')">
			<TransitionChild
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black/80" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center p-4">
					<TransitionChild
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<DialogPanel
							class="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-gray-900 p-6 shadow-xl transition-all"
						>
							<DialogTitle
								class="text-xl font-semibold text-white mb-4 flex items-center justify-between"
							>
								<span>Trim Video</span>
								<button
									@click="emit('close')"
									class="text-gray-400 hover:text-white"
								>
									<Icon name="mdi:close" class="w-6 h-6" />
								</button>
							</DialogTitle>

							<div class="space-y-4">
								<!-- Video Preview -->
								<div class="relative aspect-video bg-black rounded-lg overflow-hidden">
									<video
										ref="videoRef"
										class="w-full h-full"
										crossorigin="anonymous"
									/>
									<canvas ref="canvasRef" class="hidden" />

									<!-- Playback Controls -->
									<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
										<button
											class="text-white hover:text-purple-400 transition-colors"
											@click="isPlaying ? pause() : play()"
										>
											<Icon
												:name="isPlaying ? 'mdi:pause' : 'mdi:play'"
												class="w-6 h-6"
											/>
										</button>
										<span class="text-white text-sm font-mono">
											{{ formatTime(currentTime) }} / {{ formatTime(duration) }}
										</span>
									</div>
								</div>

								<!-- Trim Controls -->
								<div class="bg-gray-800 rounded-lg p-4 space-y-4">
									<div class="flex items-center justify-between">
										<h3 class="text-white font-medium">Timeline</h3>
										<div class="flex items-center gap-2">
											<button
												class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
												@click="setStartToCurrent"
											>
												Set Start
											</button>
											<button
												class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
												@click="setEndToCurrent"
											>
												Set End
											</button>
										</div>
									</div>

									<!-- Timeline Track -->
									<div class="relative h-16 bg-gray-700 rounded-lg overflow-hidden">
										<!-- Waveform -->
										<div class="absolute inset-0 flex items-center gap-px px-4">
											<div
												v-for="(amp, i) in 100"
												:key="i"
												class="flex-1 bg-gray-500 rounded-full"
												:style="{ height: `${20 + Math.random() * 60}%` }"
											/>
										</div>

										<!-- Selection Range -->
										<div
											class="absolute top-0 bottom-0 bg-purple-500/30 border-x-2 border-purple-500"
											:style="{
												left: `${(startTime / duration) * 100}%`,
												width: `${((endTime - startTime) / duration) * 100}%`,
											}"
										>
											<!-- Start Handle -->
											<div
												class="absolute left-0 top-0 bottom-0 w-2 -ml-1 cursor-ew-resize bg-purple-600 hover:bg-purple-400"
												@mousedown="dragTarget = 'start'"
											/>
											<!-- End Handle -->
											<div
												class="absolute right-0 top-0 bottom-0 w-2 -mr-1 cursor-ew-resize bg-purple-600 hover:bg-purple-400"
												@mousedown="dragTarget = 'end'"
											/>
										</div>

										<!-- Playhead -->
										<div
											class="absolute top-0 bottom-0 w-0.5 bg-white cursor-pointer"
											:style="{ left: `${(currentTime / duration) * 100}%` }"
											@click="seekTo(currentTime)"
										>
											<div class="absolute -top-1 -left-1.5 w-3 h-3 bg-white rounded-full" />
										</div>
									</div>

									<!-- Time Display -->
									<div class="flex items-center justify-between text-sm text-gray-400">
										<span>Start: {{ formatTime(startTime) }}</span>
										<span>Selection: {{
												formatTime(endTime - startTime)
											}}</span>
										<span>End: {{ formatTime(endTime) }}</span>
									</div>
								</div>

								<!-- Actions -->
								<div class="flex justify-end gap-3 pt-4 border-t border-gray-700">
									<button
										class="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
										@click="emit('close')"
									>
										Cancel
									</button>
									<button
										class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
										:disabled="isProcessing || endTime <= startTime"
										@click="handleTrim"
									>
										{{ isProcessing ? "Processing..." : "Trim & Save" }}
									</button>
								</div>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
