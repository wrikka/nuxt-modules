import { reactive, readonly, computed } from "vue";

export interface FaceRetouchingState {
	isActive: boolean;
	skinSmoothing: number;
	whitening: number;
	faceSlimming: number;
	eyeEnlarging: number;
	brightness: number;
	applyToVideo: boolean;
}

export const useFaceRetouching = () => {
	const state = reactive<FaceRetouchingState>({
		isActive: false,
		skinSmoothing: 0.5,
		whitening: 0.3,
		faceSlimming: 0.2,
		eyeEnlarging: 0.1,
		brightness: 0.1,
		applyToVideo: true,
	});

	let videoElement: HTMLVideoElement | null = null;
	let canvasElement: HTMLCanvasElement | null = null;
	let animationFrame: number | null = null;

	const initialize = (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
		videoElement = video;
		canvasElement = canvas;
		return true;
	};

	const start = () => {
		if (!videoElement || !canvasElement) return;
		state.isActive = true;
		applyRetouching();
	};

	const stop = () => {
		state.isActive = false;
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
			animationFrame = null;
		}
	};

	const applyRetouching = () => {
		if (!state.isActive || !videoElement || !canvasElement) return;

		const ctx = canvasElement.getContext("2d")!;
		const width = canvasElement.width;
		const height = canvasElement.height;

		// Draw original frame
		ctx.drawImage(videoElement, 0, 0, width, height);

		// Apply retouching effects using canvas filters
		const filters: string[] = [];

		if (state.brightness > 0) {
			filters.push(`brightness(${100 + state.brightness * 30}%)`);
		}

		if (state.whitening > 0) {
			filters.push(`contrast(${100 + state.whitening * 20}%)`);
		}

		if (state.skinSmoothing > 0) {
			// Apply blur for skin smoothing effect
			const blurAmount = state.skinSmoothing * 2;
			filters.push(`blur(${blurAmount}px)`);
		}

		if (filters.length > 0) {
			ctx.filter = filters.join(" ");
			ctx.drawImage(canvasElement, 0, 0, width, height);
			ctx.filter = "none";
		}

		animationFrame = requestAnimationFrame(applyRetouching);
	};

	const setSkinSmoothing = (value: number) => {
		state.skinSmoothing = Math.max(0, Math.min(1, value));
	};

	const setWhitening = (value: number) => {
		state.whitening = Math.max(0, Math.min(1, value));
	};

	const setFaceSlimming = (value: number) => {
		state.faceSlimming = Math.max(0, Math.min(1, value));
	};

	const setEyeEnlarging = (value: number) => {
		state.eyeEnlarging = Math.max(0, Math.min(1, value));
	};

	const setBrightness = (value: number) => {
		state.brightness = Math.max(0, Math.min(1, value));
	};

	const resetAll = () => {
		state.skinSmoothing = 0.5;
		state.whitening = 0.3;
		state.faceSlimming = 0.2;
		state.eyeEnlarging = 0.1;
		state.brightness = 0.1;
	};

	onUnmounted(() => {
		stop();
	});

	return {
		state: readonly(state),
		initialize,
		start,
		stop,
		setSkinSmoothing,
		setWhitening,
		setFaceSlimming,
		setEyeEnlarging,
		setBrightness,
		resetAll,
	};
};
