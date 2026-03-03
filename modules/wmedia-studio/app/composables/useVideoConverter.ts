import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export const useVideoConverter = () => {
	const ffmpeg = new FFmpeg();
	const isLoaded = ref(false);
	const isConverting = ref(false);
	const progress = ref(0);
	const error = ref<string | null>(null);

	const loadFFmpeg = async () => {
		if (isLoaded.value) return;

		try {
			const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

			await ffmpeg.load({
				coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
				wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
			});

			isLoaded.value = true;
		} catch (err) {
			error.value = "Failed to load FFmpeg";
			console.error("Error loading FFmpeg:", err);
		}
	};

	const convertToMP4 = async (inputBlob: Blob, onProgress?: (progress: number) => void): Promise<Blob> => {
		if (!isLoaded.value) {
			await loadFFmpeg();
		}

		isConverting.value = true;
		progress.value = 0;
		error.value = null;

		try {
			const inputFileName = `input_${Date.now()}.webm`;
			const outputFileName = `output_${Date.now()}.mp4`;

			ffmpeg.on("progress", ({ progress: p }) => {
				progress.value = Math.round(p * 100);
				if (onProgress) {
					onProgress(progress.value);
				}
			});

			const inputData = await fetchFile(inputBlob);
			await ffmpeg.writeFile(inputFileName, inputData);

			await ffmpeg.exec([
				"-i",
				inputFileName,
				"-c:v",
				"libx264",
				"-preset",
				"medium",
				"-crf",
				"23",
				"-c:a",
				"aac",
				"-b:a",
				"128k",
				"-movflags",
				"+faststart",
				outputFileName,
			]);

			const outputData = await ffmpeg.readFile(outputFileName);

			await ffmpeg.deleteFile(inputFileName);
			await ffmpeg.deleteFile(outputFileName);

			const uint8Array = outputData instanceof Uint8Array ? outputData : new Uint8Array();
			const outputBlob = new Blob([uint8Array as any], { type: "video/mp4" });

			isConverting.value = false;
			return outputBlob;
		} catch (err) {
			error.value = "Failed to convert video";
			console.error("Error converting video:", err);
			isConverting.value = false;
			throw err;
		}
	};

	const convertToGif = async (inputBlob: Blob, onProgress?: (progress: number) => void): Promise<Blob> => {
		if (!isLoaded.value) {
			await loadFFmpeg();
		}

		isConverting.value = true;
		progress.value = 0;
		error.value = null;

		try {
			const inputFileName = `input_${Date.now()}.webm`;
			const outputFileName = `output_${Date.now()}.gif`;

			ffmpeg.on("progress", ({ progress: p }) => {
				progress.value = Math.round(p * 100);
				if (onProgress) {
					onProgress(progress.value);
				}
			});

			const inputData = await fetchFile(inputBlob);
			await ffmpeg.writeFile(inputFileName, inputData);

			await ffmpeg.exec([
				"-i",
				inputFileName,
				"-vf",
				"fps=10,scale=480:-1:flags=lanczos",
				"-c:v",
				"gif",
				"-f",
				"gif",
				outputFileName,
			]);

			const outputData = await ffmpeg.readFile(outputFileName);

			await ffmpeg.deleteFile(inputFileName);
			await ffmpeg.deleteFile(outputFileName);

			const uint8Array = outputData instanceof Uint8Array ? outputData : new Uint8Array();
			const outputBlob = new Blob([uint8Array as any], { type: "image/gif" });

			isConverting.value = false;
			return outputBlob;
		} catch (err) {
			error.value = "Failed to convert to GIF";
			console.error("Error converting to GIF:", err);
			isConverting.value = false;
			throw err;
		}
	};

	return {
		isLoaded,
		isConverting,
		progress,
		error,
		loadFFmpeg,
		convertToMP4,
		convertToGif,
	};
};
