import type { VideoClip, VideoProject } from "#shared/types";
import { calculateTransitionOpacity, getActiveClipsAtTime, getAnimatedValue } from "#shared/utils/animation";
import { onUnmounted } from "vue";

export interface PreviewOptions {
	fps?: number;
	quality?: number;
	backgroundColor?: string;
}

export const useVideoPreview = () => {
	const videoStore = useVideoStore();
	const { currentTime, isPlaying, currentVideoProject } = storeToRefs(videoStore);

	const previewCanvas = ref<HTMLCanvasElement | null>(null);
	const previewContext = ref<CanvasRenderingContext2D | null>(null);
	const isPreviewReady = ref(false);
	const previewError = ref<string | null>(null);

	const videoElements = ref<Map<string, HTMLVideoElement>>(new Map());
	const imageElements = ref<Map<string, HTMLImageElement>>(new Map());

	const initPreview = (canvas: HTMLCanvasElement) => {
		previewCanvas.value = canvas;
		previewContext.value = canvas.getContext("2d");

		if (!previewContext.value) {
			previewError.value = "Failed to get canvas context";
			return;
		}

		isPreviewReady.value = true;
		previewError.value = null;
	};

	const resizePreview = (width: number, height: number) => {
		if (!previewCanvas.value || !previewContext.value) return;

		previewCanvas.value.width = width;
		previewCanvas.value.height = height;
	};

	const loadVideoElement = async (clip: VideoClip): Promise<HTMLVideoElement> => {
		let video = videoElements.value.get(clip.id);

		if (!video) {
			video = document.createElement("video");
			video.crossOrigin = "anonymous";
			video.muted = true;
			video.preload = "auto";
			video.src = clip.sourceUrl;

			await new Promise((resolve, reject) => {
				video!.onloadedmetadata = resolve;
				video!.onerror = reject;
			});

			videoElements.value.set(clip.id, video);
		}

		return video;
	};

	const loadImageElement = async (clip: VideoClip): Promise<HTMLImageElement> => {
		let image = imageElements.value.get(clip.id);

		if (!image) {
			image = new Image();
			image.crossOrigin = "anonymous";

			await new Promise((resolve, reject) => {
				image!.onload = resolve;
				image!.onerror = reject;
				image!.src = clip.sourceUrl;
			});

			imageElements.value.set(clip.id, image);
		}

		return image;
	};

	const applyColorCorrection = (ctx: CanvasRenderingContext2D, clip: VideoClip) => {
		if (!clip.colorCorrection && !clip.colorGrading?.enabled) return;

		let filterString = "";

		// Apply basic color correction
		if (clip.colorCorrection) {
			const { brightness, contrast, saturation } = clip.colorCorrection;
			const brightnessValue = 100 + brightness;
			const contrastValue = 100 + contrast;
			const saturateValue = 100 + saturation;
			filterString += `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturateValue}%) `;
		}

		// Apply advanced color grading
		if (clip.colorGrading?.enabled) {
			const { wheels, temperature, tint, vibrance } = clip.colorGrading;

			// Temperature: sepia for warmth, hue-rotate for cool
			if (temperature !== 0) {
				const sepiaValue = temperature > 0 ? temperature / 2 : 0;
				const hueRotateValue = temperature < 0 ? temperature * 1.8 : 0;
				if (sepiaValue > 0) filterString += `sepia(${sepiaValue}%) `;
				if (hueRotateValue !== 0) filterString += `hue-rotate(${hueRotateValue}deg) `;
			}

			// Tint: subtle hue rotation
			if (tint !== 0) {
				const hueRotateTint = tint * 0.5;
				filterString += `hue-rotate(${hueRotateTint}deg) `;
			}

			// Vibrance affects saturation
			if (vibrance !== 0) {
				const vibranceValue = 100 + vibrance;
				filterString += `saturate(${vibranceValue}%) `;
			}

			// Apply average of all three wheels (simplified)
			const avgHue = (wheels.shadows.hue + wheels.midtones.hue + wheels.highlights.hue) / 3;
			const avgValue = (wheels.shadows.value + wheels.midtones.value + wheels.highlights.value) / 3;
			const avgSat = (wheels.shadows.saturation + wheels.midtones.saturation + wheels.highlights.saturation) / 3;

			if (avgHue !== 0) filterString += `hue-rotate(${avgHue}deg) `;
			if (avgValue !== 0) {
				const brightnessValue = 100 + avgValue;
				filterString += `brightness(${brightnessValue}%) `;
			}
			if (avgSat !== 0) {
				const satValue = 100 + avgSat;
				filterString += `saturate(${satValue}%) `;
			}
		}

		if (filterString.trim()) {
			ctx.filter = filterString.trim();
		}
	};

	const resetColorCorrection = (ctx: CanvasRenderingContext2D) => {
		ctx.filter = "none";
	};

	const renderFrame = async (time: number, project: VideoProject, options: PreviewOptions = {}) => {
		if (!previewCanvas.value || !previewContext.value) {
			previewError.value = "Preview not initialized";
			return;
		}

		const ctx = previewContext.value;
		const width = previewCanvas.value.width;
		const height = previewCanvas.value.height;

		ctx.clearRect(0, 0, width, height);

		ctx.fillStyle = options.backgroundColor || project.settings.backgroundColor || "#000000";
		ctx.fillRect(0, 0, width, height);

		const activeClips = getActiveClipsAtTime(project, time);

		for (const clip of activeClips) {
			if (clip.type === "video") {
				try {
					const video = await loadVideoElement(clip);
					const clipTime = time - clip.startTime;

					if (Math.abs(video.currentTime - clipTime) > 0.1) {
						video.currentTime = clipTime;
					}

					ctx.save();

					if (clip.transform) {
						const x = getAnimatedValue(clip.transform.x, clipTime);
						const y = getAnimatedValue(clip.transform.y, clipTime);
						const scale = getAnimatedValue(clip.transform.scale, clipTime);
						const rotation = getAnimatedValue(clip.transform.rotation, clipTime);
						const baseOpacity = getAnimatedValue(clip.transform.opacity, clipTime);
						const opacity = calculateTransitionOpacity(clip, time, baseOpacity);

						const centerX = width / 2 + x;
						const centerY = height / 2 + y;

						ctx.translate(centerX, centerY);
						ctx.rotate((rotation * Math.PI) / 180);
						ctx.scale(scale, scale);
						ctx.globalAlpha = opacity;
						ctx.translate(-centerX, -centerY);
					}

					applyColorCorrection(ctx, clip);

					ctx.drawImage(video, 0, 0, width, height);
					resetColorCorrection(ctx);
					ctx.restore();
				} catch (error) {
					console.error(`Failed to render video clip ${clip.id}:`, error);
				}
			} else if (clip.type === "image") {
				try {
					const image = await loadImageElement(clip);

					ctx.save();

					if (clip.transform) {
						const clipTime = time - clip.startTime;
						const x = getAnimatedValue(clip.transform.x, clipTime);
						const y = getAnimatedValue(clip.transform.y, clipTime);
						const scale = getAnimatedValue(clip.transform.scale, clipTime);
						const rotation = getAnimatedValue(clip.transform.rotation, clipTime);
						const baseOpacity = getAnimatedValue(clip.transform.opacity, clipTime);
						const opacity = calculateTransitionOpacity(clip, time, baseOpacity);

						const centerX = width / 2 + x;
						const centerY = height / 2 + y;

						ctx.translate(centerX, centerY);
						ctx.rotate((rotation * Math.PI) / 180);
						ctx.scale(scale, scale);
						ctx.globalAlpha = opacity;
						ctx.translate(-centerX, -centerY);
					}

					applyColorCorrection(ctx, clip);

					ctx.drawImage(image, 0, 0, width, height);
					resetColorCorrection(ctx);
					ctx.restore();
				} catch (error) {
					console.error(`Failed to render image clip ${clip.id}:`, error);
				}
			} else if (clip.type === "text") {
				ctx.save();

				if (clip.transform) {
					const clipTime = time - clip.startTime;
					const x = getAnimatedValue(clip.transform.x, clipTime);
					const y = getAnimatedValue(clip.transform.y, clipTime);
					const scale = getAnimatedValue(clip.transform.scale, clipTime);
					const rotation = getAnimatedValue(clip.transform.rotation, clipTime);
					const baseOpacity = getAnimatedValue(clip.transform.opacity, clipTime);
					const opacity = calculateTransitionOpacity(clip, time, baseOpacity);

					const centerX = width / 2 + x;
					const centerY = height / 2 + y;

					ctx.translate(centerX, centerY);
					ctx.rotate((rotation * Math.PI) / 180);
					ctx.scale(scale, scale);
					ctx.globalAlpha = opacity;
					ctx.translate(-centerX, -centerY);
				}

				ctx.fillStyle = "#ffffff";
				ctx.font = "bold 24px Inter, sans-serif";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(clip.name, width / 2, height / 2);

				ctx.restore();
			}
		}

		// Render captions if enabled
		renderCaptions(ctx, time, project, width, height);
	};

	const renderCaptions = (
		ctx: CanvasRenderingContext2D,
		time: number,
		project: VideoProject,
		width: number,
		height: number,
	) => {
		if (!project.captions || project.captions.length === 0) return;

		// Find active caption at current time
		const activeCaption = project.captions.find(
			(c) => time >= c.startTime && time <= c.endTime,
		);

		if (!activeCaption) return;

		// Draw caption background
		ctx.save();
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";

		// Calculate text dimensions
		const fontSize = Math.floor(height * 0.04);
		ctx.font = `${fontSize}px Inter, sans-serif`;
		const maxWidth = width * 0.8;
		const lineHeight = fontSize * 1.4;

		// Word wrap text
		const words = activeCaption.text.split(" ");
		const lines: string[] = [];
		let currentLine = "";

		for (const word of words) {
			const testLine = currentLine ? `${currentLine} ${word}` : word;
			const metrics = ctx.measureText(testLine);

			if (metrics.width > maxWidth && currentLine) {
				lines.push(currentLine);
				currentLine = word;
			} else {
				currentLine = testLine;
			}
		}
		if (currentLine) lines.push(currentLine);

		const padding = fontSize * 0.8;
		const boxWidth = Math.min(maxWidth + padding * 2, width * 0.9);
		const boxHeight = lines.length * lineHeight + padding * 2;
		const x = (width - boxWidth) / 2;
		const y = height - boxHeight - height * 0.05;

		// Draw background
		ctx.fillRect(x, y, boxWidth, boxHeight);

		// Draw text
		ctx.fillStyle = "#ffffff";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";

		lines.forEach((line, index) => {
			ctx.fillText(line, width / 2, y + padding + index * lineHeight);
		});

		ctx.restore();
	};

	const startPreviewLoop = (options: PreviewOptions = {}) => {
		if (!currentVideoProject.value) return;

		const loop = () => {
			if (isPlaying.value && currentVideoProject.value) {
				void renderFrame(currentTime.value, currentVideoProject.value, options);
			}
			requestAnimationFrame(loop);
		};

		loop();
	};

	const captureFrame = async (
		time: number,
		project: VideoProject,
		options: PreviewOptions = {},
	): Promise<Blob | null> => {
		if (!previewCanvas.value || !previewContext.value) {
			previewError.value = "Preview not initialized";
			return null;
		}

		await renderFrame(time, project, options);

		return new Promise((resolve) => {
			previewCanvas.value!.toBlob(
				(blob) => {
					resolve(blob);
				},
				"image/png",
				options.quality || 1,
			);
		});
	};

	const exportPreviewFrames = async (
		project: VideoProject,
		options: PreviewOptions = {},
		onProgress?: (progress: number) => void,
	): Promise<Blob[]> => {
		const frames: Blob[] = [];
		const fps = options.fps || 30;
		const totalFrames = Math.ceil(project.duration * fps);

		for (let i = 0; i < totalFrames; i++) {
			const time = (i / totalFrames) * project.duration;
			const frame = await captureFrame(time, project, options);

			if (frame) {
				frames.push(frame);
			}

			if (onProgress) {
				onProgress((i / totalFrames) * 100);
			}
		}

		return frames;
	};

	const clearCache = () => {
		videoElements.value.forEach((video) => {
			video.pause();
			video.src = "";
		});
		videoElements.value.clear();

		imageElements.value.clear();
	};

	onUnmounted(() => {
		clearCache();
	});

	return {
		previewCanvas,
		previewContext,
		isPreviewReady,
		previewError,
		initPreview,
		resizePreview,
		renderFrame,
		startPreviewLoop,
		captureFrame,
		exportPreviewFrames,
		clearCache,
	};
};
