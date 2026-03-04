export interface GreenScreenOptions {
	lowerColor?: [number, number, number];
	upperColor?: [number, number, number];
	smoothness?: number;
	spillSuppression?: number;
	backgroundImage?: string;
	backgroundColor?: string;
}

export interface GreenScreenState {
	isActive: boolean;
	canvas?: HTMLCanvasElement;
	options: GreenScreenOptions;
}

export const useGreenScreen = () => {
	const defaultOptions: GreenScreenOptions = {
		lowerColor: [0, 100, 0],
		upperColor: [100, 255, 100],
		smoothness: 0.1,
		spillSuppression: 0.5,
		backgroundColor: "#000000",
	};

	const state = reactive<GreenScreenState>({
		isActive: false,
		options: { ...defaultOptions },
	});

	let sourceVideo: HTMLVideoElement | null = null;
	let outputCanvas: HTMLCanvasElement | null = null;
	let animationFrame: number | null = null;

	const initialize = (
		videoElement: HTMLVideoElement,
		canvasElement: HTMLCanvasElement,
		options?: GreenScreenOptions
	) => {
		sourceVideo = videoElement;
		outputCanvas = canvasElement;
		
		if (options) {
			Object.assign(state.options, options);
		}

		const ctx = canvasElement.getContext("2d");
		if (!ctx) return false;

		canvasElement.width = videoElement.videoWidth || 640;
		canvasElement.height = videoElement.videoHeight || 480;

		return true;
	};

	const applyChromaKey = (
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number
	) => {
		if (!sourceVideo || !outputCanvas) return;

		ctx.drawImage(sourceVideo, 0, 0, width, height);
		
		const imageData = ctx.getImageData(0, 0, width, height);
		const data = imageData.data;
		
		const { lowerColor, upperColor, smoothness, spillSuppression, backgroundColor } = state.options;
		
		const bgColor = backgroundColor || "#000000";
		const r = parseInt(bgColor.slice(1, 3), 16);
		const g = parseInt(bgColor.slice(3, 5), 16);
		const b = parseInt(bgColor.slice(5, 7), 16);

		for (let i = 0; i < data.length; i += 4) {
			const pixelR = data[i];
			const pixelG = data[i + 1];
			const pixelB = data[i + 2];

			// ตรวจสอบว่าอยู่ในช่วงสีเขียว
			if (
				pixelR >= (lowerColor?.[0] || 0) &&
				pixelR <= (upperColor?.[0] || 100) &&
				pixelG >= (lowerColor?.[1] || 100) &&
				pixelG <= (upperColor?.[1] || 255) &&
				pixelB >= (lowerColor?.[2] || 0) &&
				pixelB <= (upperColor?.[2] || 100)
			) {
				// Spill suppression
				if (spillSuppression && spillSuppression > 0) {
					const factor = spillSuppression;
					data[i] = pixelR * (1 - factor) + r * factor;
					data[i + 1] = pixelG * (1 - factor) + g * factor;
					data[i + 2] = pixelB * (1 - factor) + b * factor;
				}
				
				// ความโปร่งใส
				data[i + 3] = 0;
			}
		}

		ctx.putImageData(imageData, 0, 0);
	};

	const start = () => {
		if (!sourceVideo || !outputCanvas) return;

		state.isActive = true;
		const ctx = outputCanvas.getContext("2d");
		if (!ctx) return;

		const process = () => {
			if (!state.isActive) return;

			applyChromaKey(ctx, outputCanvas!.width, outputCanvas!.height);
			animationFrame = requestAnimationFrame(process);
		};

		process();
	};

	const stop = () => {
		state.isActive = false;
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
			animationFrame = null;
		}
	};

	const setColorRange = (
		lower: [number, number, number],
		upper: [number, number, number]
	) => {
		state.options.lowerColor = lower;
		state.options.upperColor = upper;
	};

	const setBackgroundColor = (color: string) => {
		state.options.backgroundColor = color;
		state.options.backgroundImage = undefined;
	};

	const setBackgroundImage = (url: string) => {
		state.options.backgroundImage = url;
	};

	const setSmoothness = (value: number) => {
		state.options.smoothness = Math.max(0, Math.min(1, value));
	};

	const setSpillSuppression = (value: number) => {
		state.options.spillSuppression = Math.max(0, Math.min(1, value));
	};

	const dispose = () => {
		stop();
		sourceVideo = null;
		outputCanvas = null;
	};

	onUnmounted(() => {
		dispose();
	});

	return {
		state: readonly(state),
		initialize,
		start,
		stop,
		setColorRange,
		setBackgroundColor,
		setBackgroundImage,
		setSmoothness,
		setSpillSuppression,
		dispose,
	};
};
