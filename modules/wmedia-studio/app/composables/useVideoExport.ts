import type { VideoClip, VideoProject } from "#shared/types";
import { useMediaBunny } from "./useMediaBunny";

export interface RecordingExportOptions {
	format: "mp4" | "webm" | "gif" | "mov";
	quality: "low" | "medium" | "high" | "ultra";
	resolution?: { width: number; height: number };
	fps?: number;
	bitrate?: number;
	audioBitrate?: number;
}

export interface VideoExportPreset {
	name: string;
	format: RecordingExportOptions["format"];
	quality: RecordingExportOptions["quality"];
	resolution: { width: number; height: number };
	fps: number;
}

export const defaultPresets: VideoExportPreset[] = [
	{ name: "YouTube 1080p", format: "mp4", quality: "high", resolution: { width: 1920, height: 1080 }, fps: 30 },
	{ name: "YouTube 4K", format: "mp4", quality: "ultra", resolution: { width: 3840, height: 2160 }, fps: 30 },
	{ name: "Instagram/Social", format: "mp4", quality: "medium", resolution: { width: 1080, height: 1080 }, fps: 30 },
	{ name: "TikTok/Reels", format: "mp4", quality: "medium", resolution: { width: 1080, height: 1920 }, fps: 30 },
	{ name: "GIF Small", format: "gif", quality: "low", resolution: { width: 480, height: 270 }, fps: 15 },
	{ name: "GIF Medium", format: "gif", quality: "medium", resolution: { width: 720, height: 405 }, fps: 20 },
	{ name: "ProRes Master", format: "mov", quality: "ultra", resolution: { width: 1920, height: 1080 }, fps: 30 },
	{ name: "Web Optimized", format: "webm", quality: "medium", resolution: { width: 1280, height: 720 }, fps: 30 },
];

export interface ExportProgress {
	percentage: number;
	currentFrame: number;
	totalFrames: number;
	currentTime: number;
	totalTime: number;
	stage: "preparing" | "rendering" | "encoding" | "finalizing" | "completed";
}

export const useVideoExport = () => {
	const { exportVideo } = useMediaBunny();
	const isExporting = ref(false);
	const exportProgress = ref<ExportProgress | null>(null);
	const exportError = ref<string | null>(null);

	const renderFrameToCanvas = async (
		clip: VideoClip,
		time: number,
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
	): Promise<void> => {
		if (clip.type === "video") {
			return new Promise((resolve, reject) => {
				const video = document.createElement("video");
				video.crossOrigin = "anonymous";
				video.muted = true;
				video.src = clip.sourceUrl;
				video.currentTime = time - clip.startTime;

				video.onloadeddata = () => {
					ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
					resolve();
				};

				video.onerror = reject;
			});
		} else if (clip.type === "image") {
			return new Promise((resolve, reject) => {
				const image = new Image();
				image.crossOrigin = "anonymous";
				image.src = clip.sourceUrl;

				image.onload = () => {
					ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
					resolve();
				};

				image.onerror = reject;
			});
		} else if (clip.type === "text") {
			ctx.fillStyle = "#ffffff";
			ctx.font = "bold 48px Inter, sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(clip.name, canvas.width / 2, canvas.height / 2);
		}
	};

	const exportProject = async (
		project: VideoProject,
		options: RecordingExportOptions = { format: "mp4", quality: "high" },
		onProgress?: (progress: ExportProgress) => void,
	): Promise<Blob> => {
		isExporting.value = true;
		exportError.value = null;

		try {
			const fps = options.fps || project.fps || 30;
			const totalFrames = Math.ceil(project.duration * fps);
			const width = options.resolution?.width || project.width;
			const height = options.resolution?.height || project.height;

			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");

			if (!ctx) {
				throw new Error("Failed to get canvas context");
			}

			exportProgress.value = {
				percentage: 0,
				currentFrame: 0,
				totalFrames,
				currentTime: 0,
				totalTime: project.duration,
				stage: "preparing",
			};

			onProgress?.(exportProgress.value);

			exportProgress.value.stage = "rendering";

			for (let frame = 0; frame < totalFrames; frame++) {
				const time = frame / fps;

				ctx.fillStyle = project.settings.backgroundColor || "#000000";
				ctx.fillRect(0, 0, width, height);

				const activeClips = project.clips.filter(
					(clip) => time >= clip.startTime && time < clip.endTime,
				);

				for (const clip of activeClips) {
					await renderFrameToCanvas(clip, time, canvas, ctx);
				}

				exportProgress.value = {
					percentage: Math.round((frame / totalFrames) * 50),
					currentFrame: frame,
					totalFrames,
					currentTime: time,
					totalTime: project.duration,
					stage: "rendering",
				};

				onProgress?.(exportProgress.value);
			}

			exportProgress.value.stage = "encoding";
			onProgress?.(exportProgress.value);

			// Only mp4 and webm are supported by useMediaBunny, convert to mp4 for gif
			let mediaBunnyFormat: "mp4" | "webm" = "mp4";
			if (options.format === "webm") {
				mediaBunnyFormat = "webm";
			}
			// Otherwise use mp4 (covers mp4, mov, gif cases)

			let mediaBunnyQuality: "low" | "medium" | "high" = "high";
			if (options.quality === "low" || options.quality === "medium" || options.quality === "high") {
				mediaBunnyQuality = options.quality;
			}
			// ultra falls back to high

			const blob = await exportVideo(canvas, {
				format: mediaBunnyFormat,
				quality: mediaBunnyQuality,
				bitrate: options.bitrate,
				fps,
				resolution: { width, height },
			});

			exportProgress.value = {
				percentage: 100,
				currentFrame: totalFrames,
				totalFrames,
				currentTime: project.duration,
				totalTime: project.duration,
				stage: "completed",
			};

			onProgress?.(exportProgress.value);

			return blob;
		} catch (error) {
			exportError.value = error instanceof Error ? error.message : "Export failed";
			throw error;
		} finally {
			isExporting.value = false;
		}
	};

	const exportWithFFmpeg = async (
		project: VideoProject,
		options: RecordingExportOptions = { format: "mp4", quality: "high" },
		onProgress?: (progress: ExportProgress) => void,
	): Promise<Blob> => {
		isExporting.value = true;
		exportError.value = null;

		try {
			const { FFmpeg } = await import("@ffmpeg/ffmpeg");
			const { fetchFile } = await import("@ffmpeg/util");

			const ffmpeg = new FFmpeg();

			ffmpeg.on("log", ({ message }) => {
				console.log("FFmpeg:", message);
			});

			ffmpeg.on("progress", ({ progress }) => {
				exportProgress.value = {
					percentage: Math.round(progress * 100),
					currentFrame: 0,
					totalFrames: 0,
					currentTime: 0,
					totalTime: project.duration,
					stage: "encoding",
				};
				onProgress?.(exportProgress.value);
			});

			await ffmpeg.load();

			const fps = options.fps || project.fps || 30;
			const width = options.resolution?.width || project.width;
			const height = options.resolution?.height || project.height;

			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");

			if (!ctx) {
				throw new Error("Failed to get canvas context");
			}

			const frames: string[] = [];
			const totalFrames = Math.ceil(project.duration * fps);

			exportProgress.value = {
				percentage: 0,
				currentFrame: 0,
				totalFrames,
				currentTime: 0,
				totalTime: project.duration,
				stage: "preparing",
			};

			onProgress?.(exportProgress.value);

			exportProgress.value.stage = "rendering";

			for (let frame = 0; frame < totalFrames; frame++) {
				const time = frame / fps;

				ctx.fillStyle = project.settings.backgroundColor || "#000000";
				ctx.fillRect(0, 0, width, height);

				const activeClips = project.clips.filter(
					(clip) => time >= clip.startTime && time < clip.endTime,
				);

				for (const clip of activeClips) {
					await renderFrameToCanvas(clip, time, canvas, ctx);
				}

				const frameData = canvas.toDataURL("image/png");
				frames.push(frameData);

				exportProgress.value = {
					percentage: Math.round((frame / totalFrames) * 50),
					currentFrame: frame,
					totalFrames,
					currentTime: time,
					totalTime: project.duration,
					stage: "rendering",
				};

				onProgress?.(exportProgress.value);
			}

			exportProgress.value.stage = "encoding";
			onProgress?.(exportProgress.value);

			for (let i = 0; i < frames.length; i++) {
				const frameData = await fetchFile(frames[i]);
				await ffmpeg.writeFile(`frame_${i.toString().padStart(6, "0")}.png`, frameData);
			}

			const inputPattern = `frame_%06d.png`;
			const outputFilename = `output.${options.format}`;

			const bitrateMap = {
				low: "1M",
				medium: "3M",
				high: "8M",
				ultra: "20M",
			};

			const bitrate = options.bitrate || bitrateMap[options.quality];

			const videoCodec = options.format === "webm"
				? "libvpx-vp9"
				: options.format === "mov"
				? "prores_ks"
				: "libx264";

			const codecOptions = options.format === "mov"
				? ["-profile:v", "3", "-qscale:v", "9", "-vendor", "ap10", "-pix_fmt", "yuv422p10le"]
				: ["-pix_fmt", "yuv420p"];

			await ffmpeg.exec([
				"-framerate",
				fps.toString(),
				"-i",
				inputPattern,
				"-c:v",
				videoCodec,
				"-b:v",
				bitrate.toString(),
				...codecOptions,
				"-r",
				fps.toString(),
				outputFilename,
			]);

			const data = await ffmpeg.readFile(outputFilename);
			const uint8Array = data instanceof Uint8Array ? data : new Uint8Array();
			const blob = new Blob([uint8Array as any], { type: `video/${options.format}` });

			exportProgress.value = {
				percentage: 100,
				currentFrame: totalFrames,
				totalFrames,
				currentTime: project.duration,
				totalTime: project.duration,
				stage: "completed",
			};

			onProgress?.(exportProgress.value);

			return blob;
		} catch (error) {
			exportError.value = error instanceof Error ? error.message : "Export failed";
			throw error;
		} finally {
			isExporting.value = false;
		}
	};

	const exportThumbnail = async (
		project: VideoProject,
		time: number = 0,
		width: number = 320,
		height: number = 180,
	): Promise<Blob> => {
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			throw new Error("Failed to get canvas context");
		}

		ctx.fillStyle = project.settings.backgroundColor || "#000000";
		ctx.fillRect(0, 0, width, height);

		const activeClips = project.clips.filter(
			(clip) => time >= clip.startTime && time < clip.endTime,
		);

		for (const clip of activeClips) {
			await renderFrameToCanvas(clip, time, canvas, ctx);
		}

		return new Promise((resolve) => {
			canvas.toBlob(
				(blob) => {
					resolve(blob!);
				},
				"image/jpeg",
				0.8,
			);
		});
	};

	const exportRecording = async (
		blob: Blob,
		options: RecordingExportOptions,
		onProgress?: (progress: ExportProgress) => void,
	): Promise<Blob> => {
		isExporting.value = true;
		exportError.value = null;

		try {
			const { FFmpeg } = await import("@ffmpeg/ffmpeg");
			const { fetchFile } = await import("@ffmpeg/util");

			const ffmpeg = new FFmpeg();

			ffmpeg.on("log", ({ message }) => {
				console.log("FFmpeg:", message);
			});

			ffmpeg.on("progress", ({ progress }) => {
				exportProgress.value = {
					percentage: Math.round(progress * 100),
					currentFrame: 0,
					totalFrames: 0,
					currentTime: 0,
					totalTime: 0,
					stage: "encoding",
				};
				onProgress?.(exportProgress.value);
			});

			await ffmpeg.load();

			const inputName = "input.webm";
			const outputName = `output.${options.format}`;

			exportProgress.value = {
				percentage: 0,
				currentFrame: 0,
				totalFrames: 0,
				currentTime: 0,
				totalTime: 0,
				stage: "preparing",
			};
			onProgress?.(exportProgress.value);

			await ffmpeg.writeFile(inputName, await fetchFile(blob));

			const bitrateMap = {
				low: "1M",
				medium: "3M",
				high: "8M",
				ultra: "20M",
			};

			const bitrate = options.bitrate ? `${options.bitrate}k` : bitrateMap[options.quality || "high"];

			// For non-project exports (mp4/webm), use mediabunny
			// For mov/gif, use FFmpeg directly
			if (options.format === "mov" || options.format === "gif") {
				const videoCodec = options.format === "mov" ? "prores_ks" : "libx264";
				const codecOptions = options.format === "mov"
					? ["-profile:v", "3", "-qscale:v", "9", "-vendor", "ap10", "-pix_fmt", "yuv422p10le"]
					: options.format === "gif"
					? [
						"-vf",
						`fps=${options.fps || 15},scale=${
							options.resolution?.width || 480
						}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer`,
						"-loop",
						"0",
					]
					: ["-pix_fmt", "yuv420p"];

				const args = [
					"-i",
					inputName,
					"-c:v",
					videoCodec,
					"-b:v",
					bitrate,
					...codecOptions,
					"-y",
					outputName,
				];

				await ffmpeg.exec(args);

				const data = await ffmpeg.readFile(outputName);
				const uint8Array = data instanceof Uint8Array ? data : new Uint8Array(data as any);
				const outputBlob = new Blob([uint8Array], { type: options.format === "gif" ? "image/gif" : "video/quicktime" });

				await ffmpeg.deleteFile(inputName);
				await ffmpeg.deleteFile(outputName);

				exportProgress.value = {
					percentage: 100,
					currentFrame: 0,
					totalFrames: 0,
					currentTime: 0,
					totalTime: 0,
					stage: "completed",
				};
				onProgress?.(exportProgress.value);

				return outputBlob;
			}

			// For mp4/webm, convert using standard FFmpeg
			const videoCodec = options.format === "webm" ? "libvpx-vp9" : "libx264";
			const audioCodec = options.format === "webm" ? "libopus" : "aac";

			await ffmpeg.exec([
				"-i",
				inputName,
				"-c:v",
				videoCodec,
				"-b:v",
				bitrate,
				"-pix_fmt",
				"yuv420p",
				"-c:a",
				audioCodec,
				"-b:a",
				"128k",
				"-y",
				outputName,
			]);

			const data = await ffmpeg.readFile(outputName);
			const uint8Array = data instanceof Uint8Array ? data : new Uint8Array(data as any);
			const outputBlob = new Blob([uint8Array], { type: `video/${options.format}` });

			await ffmpeg.deleteFile(inputName);
			await ffmpeg.deleteFile(outputName);

			exportProgress.value = {
				percentage: 100,
				currentFrame: 0,
				totalFrames: 0,
				currentTime: 0,
				totalTime: 0,
				stage: "completed",
			};
			onProgress?.(exportProgress.value);

			return outputBlob;
		} catch (error) {
			exportError.value = error instanceof Error ? error.message : "Export failed";
			throw error;
		} finally {
			isExporting.value = false;
		}
	};

	const cancelExport = () => {
		isExporting.value = false;
		exportProgress.value = null;
	};

	return {
		isExporting,
		exportProgress,
		exportError,
		exportProject,
		exportWithFFmpeg,
		exportRecording,
		exportThumbnail,
		cancelExport,
		defaultPresets,
	};
};
