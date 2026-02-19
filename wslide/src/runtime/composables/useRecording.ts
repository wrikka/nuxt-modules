import { computed, onUnmounted, readonly, ref } from "vue";

const isRecording = ref(false);
const recordingTime = ref(0);
const mediaRecorder = ref<MediaRecorder | null>(null);
const recordedChunks = ref<Blob[]>([]);
let recordingInterval: ReturnType<typeof setInterval> | null = null;

export function useRecording() {
	async function startRecording() {
		if (isRecording.value) return;

		try {
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
				audio: true,
			});

			mediaRecorder.value = new MediaRecorder(stream);
			recordedChunks.value = [];

			mediaRecorder.value.ondataavailable = (event) => {
				if (event.data.size > 0) {
					recordedChunks.value.push(event.data);
				}
			};

			mediaRecorder.value.onstop = () => {
				const blob = new Blob(recordedChunks.value, { type: "video/webm" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `wslide-recording-${Date.now()}.webm`;
				a.click();
				URL.revokeObjectURL(url);
			};

			mediaRecorder.value.start();
			isRecording.value = true;

			recordingInterval = setInterval(() => {
				recordingTime.value++;
			}, 1000);
		} catch (err) {
			console.error("Failed to start recording:", err);
		}
	}

	function stopRecording() {
		if (!isRecording.value || !mediaRecorder.value) return;

		mediaRecorder.value.stop();
		mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
		isRecording.value = false;

		if (recordingInterval) {
			clearInterval(recordingInterval);
			recordingInterval = null;
		}
		recordingTime.value = 0;
	}

	function toggleRecording() {
		if (isRecording.value) {
			stopRecording();
		} else {
			startRecording();
		}
	}

	const formattedTime = computed(() => {
		const hours = Math.floor(recordingTime.value / 3600);
		const minutes = Math.floor((recordingTime.value % 3600) / 60);
		const seconds = recordingTime.value % 60;

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
		}
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	});

	onUnmounted(() => {
		if (isRecording.value) {
			stopRecording();
		}
	});

	return {
		isRecording: readonly(isRecording),
		recordingTime: readonly(recordingTime),
		formattedTime: readonly(formattedTime),
		startRecording,
		stopRecording,
		toggleRecording,
	};
}
