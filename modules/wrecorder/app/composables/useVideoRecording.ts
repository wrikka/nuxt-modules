import type { Recording, RecordingSource } from "../components/video-recording/types";

export interface UseVideoRecordingOptions {
	onRecordingStart?: () => void;
	onRecordingStop?: (recording: Recording) => void;
	onRecordingError?: (error: Error) => void;
	onAutoSave?: (recording: Recording) => void;
}

export const useVideoRecording = (options: UseVideoRecordingOptions = {}) => {
	const mediaStream = ref<MediaStream | null>(null);
	const mediaRecorder = ref<MediaRecorder | null>(null);
	const recordedChunks = ref<Blob[]>([]);
	const isRecording = ref(false);
	const isPaused = ref(false);
	const isCountingDown = ref(false);
	const countdownValue = ref(0);
	const recordingTime = ref(0);
	const recordingSource = ref<RecordingSource>("screen");
	const audioEnabled = ref(true);
	const cameraEnabled = ref(false);
	const selectedAudioDevice = ref("");
	const videoResolution = ref(1080);
	const videoBitrate = ref(5000);
	const currentMimeType = ref("");
	const autoSaveInterval = ref(30);
	const lastAutoSaveTime = ref(0);

	let recordingInterval: NodeJS.Timeout | null = null;
	let autoSaveTimer: NodeJS.Timeout | null = null;

	const startCountdown = async (seconds = 3): Promise<void> => {
		isCountingDown.value = true;
		countdownValue.value = seconds;

		for (let i = seconds; i > 0; i--) {
			countdownValue.value = i;
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}

		isCountingDown.value = false;
	};

	const startRecording = async (): Promise<void> => {
		try {
			let stream: MediaStream;

			if (recordingSource.value === "screen") {
				const audioConstraints = audioEnabled.value
					? { deviceId: selectedAudioDevice.value || undefined }
					: false;
				stream = await navigator.mediaDevices.getDisplayMedia({
					video: {
						cursor: "always" as any,
						height: { ideal: videoResolution.value },
						frameRate: { ideal: 30 },
					} as any,
					audio: audioConstraints as any,
				});
			} else if (recordingSource.value === "camera") {
				const audioConstraints = audioEnabled.value
					? { deviceId: selectedAudioDevice.value || undefined }
					: false;
				stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: "user",
						height: { ideal: videoResolution.value },
						frameRate: { ideal: 30 },
					},
					audio: audioConstraints as any,
				});
			} else {
				const screenStream = await navigator.mediaDevices.getDisplayMedia({
					video: { cursor: "always" } as any,
					audio: false,
				});
				const audioConstraints = audioEnabled.value
					? { deviceId: selectedAudioDevice.value || undefined }
					: false;
				const cameraStream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: "user",
						height: { ideal: videoResolution.value },
						frameRate: { ideal: 30 },
					},
					audio: audioConstraints as any,
				});
				stream = new MediaStream([
					...screenStream.getVideoTracks(),
					...cameraStream.getAudioTracks(),
				]);
			}

			mediaStream.value = stream;

			const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
				? "video/webm;codecs=vp9"
				: "video/webm";

			currentMimeType.value = mimeType;

			mediaRecorder.value = new MediaRecorder(stream, {
				mimeType,
				videoBitsPerSecond: videoBitrate.value * 1000,
			});
			recordedChunks.value = [];

			mediaRecorder.value.ondataavailable = (event) => {
				if (event.data.size > 0) {
					recordedChunks.value.push(event.data);
				}
			};

			mediaRecorder.value.start(1000);
			isRecording.value = true;
			lastAutoSaveTime.value = Date.now();

			recordingInterval = setInterval(() => {
				recordingTime.value++;
				const now = Date.now();
				const elapsedSinceLastSave = (now - lastAutoSaveTime.value) / 1000;
				if (elapsedSinceLastSave >= autoSaveInterval.value && !isPaused.value) {
					lastAutoSaveTime.value = now;
				}
			}, 1000);

			stream.getTracks().forEach((track) => {
				track.onended = () => {
					if (isRecording.value) {
						stopRecording();
					}
				};
			});

			options.onRecordingStart?.();
		} catch (error) {
			options.onRecordingError?.(error as Error);
			throw error;
		}
	};

	const pauseRecording = (): void => {
		if (mediaRecorder.value && isRecording.value && !isPaused.value) {
			mediaRecorder.value.pause();
			isPaused.value = true;
			if (recordingInterval) {
				clearInterval(recordingInterval);
				recordingInterval = null;
			}
		}
	};

	const resumeRecording = (): void => {
		if (mediaRecorder.value && isRecording.value && isPaused.value) {
			mediaRecorder.value.resume();
			isPaused.value = false;
			recordingInterval = setInterval(() => {
				recordingTime.value++;
			}, 1000);
		}
	};

	const stopRecording = async (): Promise<Recording | null> => {
		return new Promise((resolve) => {
			if (!mediaRecorder.value || !isRecording.value) {
				resolve(null);
				return;
			}

			if (isPaused.value) {
				mediaRecorder.value.resume();
			}

			mediaRecorder.value.onstop = () => {
				const blob = new Blob(recordedChunks.value, { type: currentMimeType.value });
				const url = URL.createObjectURL(blob);
				const recording: Recording = {
					id: crypto.randomUUID(),
					blob,
					url,
					duration: recordingTime.value,
					timestamp: Date.now(),
					name: `Recording`,
				};

				recordingTime.value = 0;
				isRecording.value = false;
				isPaused.value = false;

				if (recordingInterval) {
					clearInterval(recordingInterval);
					recordingInterval = null;
				}

				if (autoSaveTimer) {
					clearTimeout(autoSaveTimer);
					autoSaveTimer = null;
				}

				if (mediaStream.value) {
					mediaStream.value.getTracks().forEach((track) => track.stop());
					mediaStream.value = null;
				}

				options.onRecordingStop?.(recording);
				resolve(recording);
			};

			mediaRecorder.value.stop();
		});
	};

	const createPartialRecording = (): Recording | null => {
		if (!mediaRecorder.value || recordedChunks.value.length === 0) return null;

		const blob = new Blob(recordedChunks.value, { type: currentMimeType.value });
		const url = URL.createObjectURL(blob);
		return {
			id: crypto.randomUUID(),
			blob,
			url,
			duration: recordingTime.value,
			timestamp: Date.now(),
			name: `Auto-save ${new Date().toLocaleTimeString()}`,
		};
	};

	const cleanup = (): void => {
		if (recordingInterval) {
			clearInterval(recordingInterval);
			recordingInterval = null;
		}
		if (mediaStream.value) {
			mediaStream.value.getTracks().forEach((track) => track.stop());
			mediaStream.value = null;
		}
	};

	onUnmounted(() => {
		cleanup();
	});

	return {
		// State
		mediaStream,
		mediaRecorder,
		recordedChunks,
		isRecording,
		isPaused,
		isCountingDown,
		countdownValue,
		recordingTime,
		recordingSource,
		audioEnabled,
		cameraEnabled,
		selectedAudioDevice,
		videoResolution,
		videoBitrate,
		currentMimeType,
		autoSaveInterval,
		lastAutoSaveTime,
		// Actions
		startCountdown,
		startRecording,
		pauseRecording,
		resumeRecording,
		stopRecording,
		createPartialRecording,
		cleanup,
	};
};
