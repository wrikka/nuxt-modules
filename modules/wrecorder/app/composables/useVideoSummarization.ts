import { reactive, readonly, computed } from "vue";

export interface VideoHighlight {
	id: string;
	startTime: number;
	endTime: number;
	importance: number;
	sceneType: "action" | "speech" | "silence" | "motion" | "static";
	thumbnail?: string;
}

export interface VideoSummarizationState {
	isProcessing: boolean;
	progress: number;
	highlights: VideoHighlight[];
	summaryDuration: number;
	originalDuration: number;
	compressionRatio: number;
	targetDuration?: number;
}

export const useVideoSummarization = () => {
	const state = reactive<VideoSummarizationState>({
		isProcessing: false,
		progress: 0,
		highlights: [],
		summaryDuration: 0,
		originalDuration: 0,
		compressionRatio: 0.3,
	});

	const analyzeVideo = async (videoBlob: Blob, targetDuration?: number): Promise<VideoHighlight[]> => {
		state.isProcessing = true;
		state.progress = 0;
		state.targetDuration = targetDuration;

		try {
			const video = document.createElement("video");
			const url = URL.createObjectURL(videoBlob);
			video.src = url;

			await new Promise<void>((resolve) => {
				video.onloadedmetadata = () => resolve();
			});

			state.originalDuration = video.duration;
			const target = targetDuration || video.duration * state.compressionRatio;

			// Extract frames for analysis
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d")!;
			canvas.width = 160;
			canvas.height = 90;

			const sampleInterval = 1;
			const numSamples = Math.floor(video.duration / sampleInterval);
			const scenes: { time: number; type: string; importance: number }[] = [];

			let prevFrame: ImageData | null = null;

			for (let i = 0; i < numSamples; i++) {
				video.currentTime = i * sampleInterval;
				await new Promise<void>((resolve) => {
					video.onseeked = () => resolve();
				});

				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

				// Analyze scene
				const motion = prevFrame ? detectMotion(prevFrame, frame) : 0;
				const activity = analyzeActivity(frame);

				let type: string = "static";
				let importance = 0;

				if (motion > 0.3) {
					type = "motion";
					importance = 0.8;
				} else if (activity > 0.5) {
					type = "action";
					importance = 0.7;
				} else if (motion < 0.05) {
					type = "silence";
					importance = 0.1;
				} else {
					type = "static";
					importance = 0.3;
				}

				scenes.push({ time: i * sampleInterval, type, importance });
				prevFrame = frame;

				state.progress = (i / numSamples) * 50;
			}

			// Generate highlights based on importance
			const highlights = generateHighlights(scenes, target);
			state.highlights = highlights;
			state.summaryDuration = highlights.reduce((sum, h) => sum + (h.endTime - h.startTime), 0);

			URL.revokeObjectURL(url);
			state.progress = 100;

			return highlights;
		} finally {
			state.isProcessing = false;
		}
	};

	const detectMotion = (prev: ImageData, curr: ImageData): number => {
		let diff = 0;
		for (let i = 0; i < prev.data.length; i += 4) {
			diff += Math.abs(prev.data[i] - curr.data[i]);
			diff += Math.abs(prev.data[i + 1] - curr.data[i + 1]);
			diff += Math.abs(prev.data[i + 2] - curr.data[i + 2]);
		}
		return diff / (prev.data.length * 255);
	};

	const analyzeActivity = (frame: ImageData): number => {
		// Simple activity analysis based on color variance
		let variance = 0;
		let mean = 0;

		for (let i = 0; i < frame.data.length; i += 4) {
			mean += (frame.data[i] + frame.data[i + 1] + frame.data[i + 2]) / 3;
		}
		mean /= frame.data.length / 4;

		for (let i = 0; i < frame.data.length; i += 4) {
			const pixel = (frame.data[i] + frame.data[i + 1] + frame.data[i + 2]) / 3;
			variance += Math.pow(pixel - mean, 2);
		}

		return Math.min(1, variance / 10000);
	};

	const generateHighlights = (
		scenes: { time: number; type: string; importance: number }[],
		targetDuration: number
	): VideoHighlight[] => {
		const highlights: VideoHighlight[] = [];
		let currentDuration = 0;

		// Sort by importance
		const sorted = [...scenes].sort((a, b) => b.importance - a.importance);

		for (const scene of sorted) {
			if (currentDuration >= targetDuration) break;

			const duration = 5; // 5 seconds per highlight
			const highlight: VideoHighlight = {
				id: `highlight-${Date.now()}-${highlights.length}`,
				startTime: scene.time,
				endTime: Math.min(scene.time + duration, scenes[scenes.length - 1]?.time || scene.time + duration),
				importance: scene.importance,
				sceneType: scene.type as VideoHighlight["sceneType"],
			};

			highlights.push(highlight);
			currentDuration += duration;
		}

		// Sort by time
		return highlights.sort((a, b) => a.startTime - b.startTime);
	};

	const setCompressionRatio = (ratio: number) => {
		state.compressionRatio = Math.max(0.1, Math.min(0.9, ratio));
	};

	const exportHighlightReel = async (videoBlob: Blob): Promise<Blob | null> => {
		// In production, this would concatenate the highlight segments
		// For now, return the original blob
		return videoBlob;
	};

	return {
		state: readonly(state),
		highlights: computed(() => state.highlights),
		analyzeVideo,
		setCompressionRatio,
		exportHighlightReel,
	};
};
