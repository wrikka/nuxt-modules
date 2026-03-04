import { reactive, readonly, computed } from "vue";

export interface HDRState {
	isSupported: boolean;
	isEnabled: boolean;
	pixelRatio: number;
	colorDepth: number;
	brightness: number;
	contrast: number;
	saturation: number;
}

export const useHDRSupport = () => {
	const state = reactive<HDRState>({
		isSupported: false,
		isEnabled: false,
		pixelRatio: 1,
		colorDepth: 8,
		brightness: 1,
		contrast: 1,
		saturation: 1,
	});

	const checkSupport = (): boolean => {
		// Check for HDR support
		const mediaCapabilities = (navigator as unknown as { mediaCapabilities?: { decodingInfo?: (config: unknown) => Promise<{ supported: boolean }> } }).mediaCapabilities;
		
		if (mediaCapabilities?.decodingInfo) {
			mediaCapabilities.decodingInfo({
				type: "file",
				video: {
					contentType: 'video/mp4; codecs="hev1.2.4.L93.B0"',
					width: 1920,
					height: 1080,
					bitrate: 10000000,
					framerate: 30,
				},
			}).then((info: { supported: boolean }) => {
				state.isSupported = info.supported;
			}).catch(() => {
				state.isSupported = false;
			});
		}

		// Check color depth
		if (typeof window !== "undefined" && "screen" in window) {
			state.colorDepth = window.screen.colorDepth || 8;
			state.pixelRatio = window.devicePixelRatio || 1;
		}

		return state.isSupported;
	};

	const enableHDR = () => {
		if (state.isSupported) {
			state.isEnabled = true;
		}
	};

	const disableHDR = () => {
		state.isEnabled = false;
	};

	const applyHDREffects = (canvas: HTMLCanvasElement): CanvasRenderingContext2D | null => {
		const ctx = canvas.getContext("2d", { colorSpace: "rec2020" });
		if (!ctx) return null;

		// Apply HDR adjustments
		ctx.filter = `brightness(${state.brightness}) contrast(${state.contrast}) saturate(${state.saturation})`;

		return ctx;
	};

	const setBrightness = (value: number) => {
		state.brightness = Math.max(0.5, Math.min(2, value));
	};

	const setContrast = (value: number) => {
		state.contrast = Math.max(0.5, Math.min(2, value));
	};

	const setSaturation = (value: number) => {
		state.saturation = Math.max(0, Math.min(2, value));
	};

	const getHDRConstraints = (): MediaStreamConstraints => {
		if (!state.isEnabled) {
			return { video: true, audio: true };
		}

		return {
			video: {
				width: { ideal: 3840 },
				height: { ideal: 2160 },
				frameRate: { ideal: 60 },
			},
			audio: true,
		};
	};

	onMounted(() => {
		checkSupport();
	});

	return {
		state: readonly(state),
		checkSupport,
		enableHDR,
		disableHDR,
		applyHDREffects,
		setBrightness,
		setContrast,
		setSaturation,
		getHDRConstraints,
	};
};
