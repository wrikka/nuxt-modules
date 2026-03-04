export interface ScreenshotOptions {
	format?: "image/png" | "image/jpeg" | "image/webp";
	quality?: number;
	crop?: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
}

export interface ScreenshotResult {
	id: string;
	blob: Blob;
	url: string;
	timestamp: number;
	width: number;
	height: number;
}

export const useScreenCapture = () => {
	const isCapturing = ref(false);
	const lastScreenshot = ref<ScreenshotResult | null>(null);
	const screenshots = ref<ScreenshotResult[]>([]);

	const captureFullScreen = async (
		options: ScreenshotOptions = {},
	): Promise<ScreenshotResult> => {
		const { format = "image/png", quality = 0.95 } = options;

		isCapturing.value = true;

		try {
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: {
					cursor: "never",
					frameRate: { ideal: 1 },
				} as any,
				audio: false,
			});

			const videoTrack = stream.getVideoTracks()[0];
			const imageCapture = new ImageCapture(videoTrack);
			const bitmap = await imageCapture.grabFrame();

			const canvas = document.createElement("canvas");
			canvas.width = bitmap.width;
			canvas.height = bitmap.height;

			const ctx = canvas.getContext("2d");
			if (!ctx) throw new Error("Failed to get canvas context");

			ctx.drawImage(bitmap, 0, 0);

			let blob: Blob;
			if (format === "image/jpeg") {
				blob = await new Promise<Blob>((resolve) => {
					canvas.toBlob(
						(b) => resolve(b!),
						format,
						quality,
					);
				});
			} else {
				blob = await new Promise<Blob>((resolve) => {
					canvas.toBlob((b) => resolve(b!), format);
				});
			}

			videoTrack.stop();
			stream.getTracks().forEach((t) => t.stop());

			const result: ScreenshotResult = {
				id: crypto.randomUUID(),
				blob,
				url: URL.createObjectURL(blob),
				timestamp: Date.now(),
				width: canvas.width,
				height: canvas.height,
			};

			lastScreenshot.value = result;
			screenshots.value.push(result);

			return result;
		} catch (error) {
			throw new Error(
				`Failed to capture screen: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			isCapturing.value = false;
		}
	};

	const captureWindow = async (
		options: ScreenshotOptions = {},
	): Promise<ScreenshotResult> => {
		return captureFullScreen({
			...options,
		});
	};

	const captureRegion = async (
		region: { x: number; y: number; width: number; height: number },
		options: ScreenshotOptions = {},
	): Promise<ScreenshotResult> => {
		const { format = "image/png", quality = 0.95 } = options;

		isCapturing.value = true;

		try {
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: {
					cursor: "never",
					frameRate: { ideal: 1 },
				} as any,
				audio: false,
			});

			const videoTrack = stream.getVideoTracks()[0];
			const imageCapture = new ImageCapture(videoTrack);
			const bitmap = await imageCapture.grabFrame();

			const canvas = document.createElement("canvas");
			canvas.width = region.width;
			canvas.height = region.height;

			const ctx = canvas.getContext("2d");
			if (!ctx) throw new Error("Failed to get canvas context");

			ctx.drawImage(
				bitmap,
				region.x,
				region.y,
				region.width,
				region.height,
				0,
				0,
				region.width,
				region.height,
			);

			let blob: Blob;
			if (format === "image/jpeg") {
				blob = await new Promise<Blob>((resolve) => {
					canvas.toBlob(
						(b) => resolve(b!),
						format,
						quality,
					);
				});
			} else {
				blob = await new Promise<Blob>((resolve) => {
					canvas.toBlob((b) => resolve(b!), format);
				});
			}

			videoTrack.stop();
			stream.getTracks().forEach((t) => t.stop());

			const result: ScreenshotResult = {
				id: crypto.randomUUID(),
				blob,
				url: URL.createObjectURL(blob),
				timestamp: Date.now(),
				width: canvas.width,
				height: canvas.height,
			};

			lastScreenshot.value = result;
			screenshots.value.push(result);

			return result;
		} catch (error) {
			throw new Error(
				`Failed to capture region: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			isCapturing.value = false;
		}
	};

	const downloadScreenshot = (screenshot: ScreenshotResult, filename?: string) => {
		const a = document.createElement("a");
		a.href = screenshot.url;
		a.download =
			filename || `screenshot-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
		a.click();
	};

	const clearScreenshots = () => {
		screenshots.value.forEach((s) => URL.revokeObjectURL(s.url));
		screenshots.value = [];
		lastScreenshot.value = null;
	};

	const deleteScreenshot = (id: string) => {
		const index = screenshots.value.findIndex((s) => s.id === id);
		if (index >= 0) {
			URL.revokeObjectURL(screenshots.value[index].url);
			screenshots.value.splice(index, 1);
		}
		if (lastScreenshot.value?.id === id) {
			lastScreenshot.value = null;
		}
	};

	return {
		isCapturing,
		lastScreenshot,
		screenshots,
		captureFullScreen,
		captureWindow,
		captureRegion,
		downloadScreenshot,
		clearScreenshots,
		deleteScreenshot,
	};
};
