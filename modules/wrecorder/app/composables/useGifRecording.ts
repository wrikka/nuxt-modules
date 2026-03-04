export interface GifRecordingOptions {
	width?: number;
	height?: number;
	fps?: number;
	quality?: number;
	dithering?: boolean;
}

export interface GifRecording {
	id: string;
	blob: Blob;
	url: string;
	duration: number;
	frameCount: number;
	timestamp: number;
	width: number;
	height: number;
}

export const useGifRecording = () => {
	const isRecording = ref(false);
	const isPaused = ref(false);
	const recordingTime = ref(0);
	const frames = ref<ImageData[]>([]);
	const currentRecording = ref<GifRecording | null>(null);
	const recordings = ref<GifRecording[]>([]);

	let mediaStream: MediaStream | null = null;
	let videoElement: HTMLVideoElement | null = null;
	let canvas: HTMLCanvasElement | null = null;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationFrameId: number | null = null;
	let recordingInterval: NodeJS.Timeout | null = null;
	let startTime = 0;
	let pausedTime = 0;

	const startRecording = async (options: GifRecordingOptions = {}): Promise<void> => {
		const {
			width = 1280,
			height = 720,
			fps = 10,
		} = options;

		try {
			mediaStream = await navigator.mediaDevices.getDisplayMedia({
				video: {
					width: { ideal: width },
					height: { ideal: height },
					frameRate: { ideal: fps },
				} as any,
				audio: false,
			});

			videoElement = document.createElement("video");
			videoElement.srcObject = mediaStream;
			videoElement.muted = true;
			await videoElement.play();

			canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			ctx = canvas.getContext("2d", { willReadFrequently: true });

			if (!ctx) throw new Error("Failed to get canvas context");

			frames.value = [];
			recordingTime.value = 0;
			startTime = Date.now();
			isRecording.value = true;
			isPaused.value = false;

			const frameInterval = 1000 / fps;

			const captureFrame = () => {
				if (!isRecording.value || isPaused.value || !ctx || !videoElement) return;

				ctx.drawImage(videoElement, 0, 0, width, height);
				const frameData = ctx.getImageData(0, 0, width, height);
				frames.value.push(frameData);
			};

			recordingInterval = setInterval(captureFrame, frameInterval);

			mediaStream.getTracks().forEach((track) => {
				track.onended = () => {
					if (isRecording.value) {
						void stopRecording();
					}
				};
			});
		} catch (error) {
			isRecording.value = false;
			throw new Error(
				`Failed to start GIF recording: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	};

	const pauseRecording = (): void => {
		if (isRecording.value && !isPaused.value) {
			isPaused.value = true;
			pausedTime = Date.now();
			if (recordingInterval) {
				clearInterval(recordingInterval);
				recordingInterval = null;
			}
		}
	};

	const resumeRecording = (): void => {
		if (isRecording.value && isPaused.value) {
			isPaused.value = false;
			const frameInterval = 100;
			recordingInterval = setInterval(() => {
				if (!isRecording.value || isPaused.value || !ctx || !videoElement) return;
				ctx.drawImage(videoElement!, 0, 0);
				const frameData = ctx.getImageData(0, 0, canvas!.width, canvas!.height);
				frames.value.push(frameData);
			}, frameInterval);
		}
	};

	const stopRecording = async (): Promise<GifRecording | null> => {
		if (!isRecording.value) return null;

		isRecording.value = false;
		isPaused.value = false;

		if (recordingInterval) {
			clearInterval(recordingInterval);
			recordingInterval = null;
		}

		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}

		const duration = Math.floor((Date.now() - startTime) / 1000);

		if (mediaStream) {
			mediaStream.getTracks().forEach((t) => t.stop());
			mediaStream = null;
		}

		if (videoElement) {
			videoElement.srcObject = null;
			videoElement = null;
		}

		if (frames.value.length === 0) return null;

		const gifBlob = await encodeGif(frames.value, canvas!.width, canvas!.height);

		const recording: GifRecording = {
			id: crypto.randomUUID(),
			blob: gifBlob,
			url: URL.createObjectURL(gifBlob),
			duration,
			frameCount: frames.value.length,
			timestamp: Date.now(),
			width: canvas!.width,
			height: canvas!.height,
		};

		currentRecording.value = recording;
		recordings.value.push(recording);
		frames.value = [];
		recordingTime.value = 0;

		return recording;
	};

	const encodeGif = async (
		frames: ImageData[],
		width: number,
		height: number,
	): Promise<Blob> => {
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Failed to get canvas context");

		const delay = Math.floor(100 / frames.length);

		const gifHeader = new Uint8Array([
			0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00,
		]);
		gifHeader[6] = width & 0xff;
		gifHeader[7] = (width >> 8) & 0xff;
		gifHeader[8] = height & 0xff;
		gifHeader[9] = (height >> 8) & 0xff;
		gifHeader[10] = 0xf7;
		gifHeader[11] = 0x00;
		gifHeader[12] = 0x00;

		const gifTrailer = new Uint8Array([0x3b]);

		const netscapeExt = new Uint8Array([
			0x21, 0xff, 0x0b, 0x4e, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32,
			0x2e, 0x30, 0x03, 0x01, 0x00, 0x00, 0x00,
		]);

		const graphicControlExt = new Uint8Array([
			0x21, 0xf9, 0x04, 0x00, delay & 0xff, (delay >> 8) & 0xff, 0x00, 0x00,
		]);

		const imageDescriptor = new Uint8Array([
			0x2c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80,
		]);
		imageDescriptor[5] = width & 0xff;
		imageDescriptor[6] = (width >> 8) & 0xff;
		imageDescriptor[7] = height & 0xff;
		imageDescriptor[8] = (height >> 8) & 0xff;

		const chunks: Uint8Array[] = [gifHeader, netscapeExt];

		for (const frame of frames) {
			ctx.putImageData(frame, 0, 0);
			const imageData = ctx.getImageData(0, 0, width, height);
			const pixelBytes = new Uint8Array(imageData.data.buffer);

			chunks.push(graphicControlExt);
			chunks.push(imageDescriptor);
			chunks.push(await lzwEncode(pixelBytes));
		}

		chunks.push(gifTrailer);

		const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
		const result = new Uint8Array(totalLength);
		let offset = 0;
		for (const chunk of chunks) {
			result.set(chunk, offset);
			offset += chunk.length;
		}

		return new Blob([result], { type: "image/gif" });
	};

	const lzwEncode = async (data: Uint8Array): Promise<Uint8Array> => {
		return data;
	};

	const downloadGif = (recording: GifRecording, filename?: string) => {
		const a = document.createElement("a");
		a.href = recording.url;
		a.download =
			filename || `recording-${new Date().toISOString().replace(/[:.]/g, "-")}.gif`;
		a.click();
	};

	const clearRecordings = () => {
		recordings.value.forEach((r) => URL.revokeObjectURL(r.url));
		recordings.value = [];
		currentRecording.value = null;
	};

	const deleteRecording = (id: string) => {
		const index = recordings.value.findIndex((r) => r.id === id);
		if (index >= 0) {
			URL.revokeObjectURL(recordings.value[index].url);
			recordings.value.splice(index, 1);
		}
		if (currentRecording.value?.id === id) {
			currentRecording.value = null;
		}
	};

	onUnmounted(() => {
		if (recordingInterval) clearInterval(recordingInterval);
		if (animationFrameId) cancelAnimationFrame(animationFrameId);
		if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
		clearRecordings();
	});

	return {
		isRecording,
		isPaused,
		recordingTime,
		frames,
		currentRecording,
		recordings,
		startRecording,
		pauseRecording,
		resumeRecording,
		stopRecording,
		downloadGif,
		clearRecordings,
		deleteRecording,
	};
};
