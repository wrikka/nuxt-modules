import { reactive, readonly, computed } from "vue";

export interface ThumbnailCandidate {
	id: string;
	timestamp: number;
	dataUrl: string;
	score: number;
	hasFace: boolean;
	brightness: number;
	contrast: number;
}

export interface AutoThumbnailState {
	isProcessing: boolean;
	candidates: ThumbnailCandidate[];
	selectedId?: string;
	numCandidates: number;
}

export const useAutoThumbnail = () => {
	const state = reactive<AutoThumbnailState>({
		isProcessing: false,
		candidates: [],
		numCandidates: 5,
	});

	const generateThumbnails = async (videoBlob: Blob): Promise<ThumbnailCandidate[]> => {
		state.isProcessing = true;
		state.candidates = [];

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
			canvas.width = 640;
			canvas.height = 360;

			const candidates: ThumbnailCandidate[] = [];
			const interval = duration / (state.numCandidates + 1);

			for (let i = 1; i <= state.numCandidates; i++) {
				const time = i * interval;
				video.currentTime = time;

				await new Promise<void>((resolve) => {
					video.onseeked = () => resolve();
				});

				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

				const analysis = analyzeImage(imageData);
				const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

				const candidate: ThumbnailCandidate = {
					id: `thumb-${Date.now()}-${i}`,
					timestamp: time,
					dataUrl,
					score: analysis.score,
					hasFace: analysis.hasFace,
					brightness: analysis.brightness,
					contrast: analysis.contrast,
				};

				candidates.push(candidate);
			}

			// Sort by score (descending)
			candidates.sort((a, b) => b.score - a.score);
			state.candidates = candidates;

			if (candidates.length > 0) {
				state.selectedId = candidates[0].id;
			}

			URL.revokeObjectURL(url);
			return candidates;
		} finally {
			state.isProcessing = false;
		}
	};

	const analyzeImage = (imageData: ImageData) => {
		const data = imageData.data;
		let brightness = 0;
		let contrast = 0;
		let hasFace = false;

		// Calculate brightness
		for (let i = 0; i < data.length; i += 4) {
			const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
			brightness += gray;
		}
		brightness /= data.length / 4;

		// Calculate contrast (simplified)
		let variance = 0;
		for (let i = 0; i < data.length; i += 4) {
			const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
			variance += Math.pow(gray - brightness, 2);
		}
		contrast = Math.sqrt(variance / (data.length / 4));

		// Simple face detection based on skin tone (very basic)
		const skinPixels = detectSkinPixels(data);
		hasFace = skinPixels > 0.05; // If >5% skin-colored pixels

		// Score calculation
		let score = 0;
		score += hasFace ? 40 : 0;
		score += Math.min(30, brightness / 255 * 30); // Brightness score
		score += Math.min(30, contrast / 100 * 30); // Contrast score

		return { brightness, contrast, hasFace, score };
	};

	const detectSkinPixels = (data: Uint8ClampedArray): number => {
		let skinPixels = 0;
		const total = data.length / 4;

		for (let i = 0; i < data.length; i += 4) {
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];

			// Simple skin tone detection
			if (r > 60 && r < 255 && g > 40 && g < 220 && b > 20 && b < 170 &&
				r > g && r > b && Math.abs(r - g) > 15) {
				skinPixels++;
			}
		}

		return skinPixels / total;
	};

	const selectThumbnail = (id: string) => {
		state.selectedId = id;
	};

	const downloadThumbnail = (id?: string): string | null => {
		const thumbnailId = id || state.selectedId;
		const candidate = state.candidates.find(c => c.id === thumbnailId);
		return candidate?.dataUrl || null;
	};

	const setNumCandidates = (num: number) => {
		state.numCandidates = Math.max(3, Math.min(10, num));
	};

	return {
		state: readonly(state),
		candidates: computed(() => state.candidates),
		selectedThumbnail: computed(() => state.candidates.find(c => c.id === state.selectedId)),
		generateThumbnails,
		selectThumbnail,
		downloadThumbnail,
		setNumCandidates,
	};
};
