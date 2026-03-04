export interface Scene {
	id: string;
	startTime: number;
	endTime: number;
	type: "screen" | "webcam" | "transition" | "silence" | "action";
	confidence: number;
	thumbnail?: string;
	metadata?: Record<string, unknown>;
}

export interface SceneDetectionState {
	scenes: Scene[];
	isAnalyzing: boolean;
	progress: number;
	threshold: number;
	detectedCuts: number;
}

export const useSmartSceneDetection = () => {
	const state = reactive<SceneDetectionState>({
		scenes: [],
		isAnalyzing: false,
		progress: 0,
		threshold: 0.3,
		detectedCuts: 0,
	});

	const analyzeVideo = async (videoBlob: Blob): Promise<Scene[]> => {
		state.isAnalyzing = true;
		state.progress = 0;
		state.scenes = [];

		try {
			const video = document.createElement("video");
			const url = URL.createObjectURL(videoBlob);
			video.src = url;

			await new Promise<void>((resolve) => {
				video.onloadedmetadata = () => resolve();
			});

			const duration = video.duration;
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d")!;
			canvas.width = 320;
			canvas.height = 180;

			const sampleInterval = 1;
			const numSamples = Math.floor(duration / sampleInterval);
			const frames: ImageData[] = [];

			for (let i = 0; i < numSamples; i++) {
				video.currentTime = i * sampleInterval;
				await new Promise<void>((resolve) => {
					video.onseeked = () => resolve();
				});

				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

				state.progress = (i / numSamples) * 50;
			}

			const scenes = detectScenes(frames, sampleInterval);
			state.scenes = scenes;
			state.detectedCuts = scenes.length;
			state.progress = 100;

			URL.revokeObjectURL(url);
			return scenes;
		} finally {
			state.isAnalyzing = false;
		}
	};

	const detectScenes = (frames: ImageData[], interval: number): Scene[] => {
		const scenes: Scene[] = [];
		let lastCutIndex = 0;

		for (let i = 1; i < frames.length; i++) {
			const diff = calculateFrameDifference(frames[i - 1], frames[i]);

			if (diff > state.threshold) {
				const scene: Scene = {
					id: `scene-${Date.now()}-${i}`,
					startTime: lastCutIndex * interval,
					endTime: i * interval,
					type: diff > 0.6 ? "transition" : "screen",
					confidence: diff,
				};
				scenes.push(scene);
				lastCutIndex = i;
			}
		}

		if (lastCutIndex < frames.length - 1) {
			scenes.push({
				id: `scene-${Date.now()}-end`,
				startTime: lastCutIndex * interval,
				endTime: frames.length * interval,
				type: "screen",
				confidence: 1,
			});
		}

		return scenes;
	};

	const calculateFrameDifference = (frame1: ImageData, frame2: ImageData): number => {
		const data1 = frame1.data;
		const data2 = frame2.data;
		let diff = 0;
		const length = data1.length;

		for (let i = 0; i < length; i += 4) {
			diff += Math.abs(data1[i] - data2[i]);
			diff += Math.abs(data1[i + 1] - data2[i + 1]);
			diff += Math.abs(data1[i + 2] - data2[i + 2]);
		}

		return diff / (length * 255 / 4);
	};

	const setThreshold = (threshold: number) => {
		state.threshold = Math.max(0.1, Math.min(0.9, threshold));
	};

	const exportScenes = (): string => {
		return JSON.stringify(state.scenes, null, 2);
	};

	const getSceneAtTime = (time: number): Scene | undefined => {
		return state.scenes.find(s => time >= s.startTime && time <= s.endTime);
	};

	return {
		state: readonly(state),
		scenes: computed(() => state.scenes),
		analyzeVideo,
		setThreshold,
		exportScenes,
		getSceneAtTime,
	};
};
