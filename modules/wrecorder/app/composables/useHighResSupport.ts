export type Resolution = "720p" | "1080p" | "1440p" | "4K" | "8K" | "custom";

export interface ResolutionConfig {
	width: number;
	height: number;
	frameRate: number;
	bitrate: number;
	codec?: string;
}

export interface HighResState {
	supportedResolutions: Resolution[];
	currentResolution: Resolution;
	isSupported: boolean;
	performanceWarning: boolean;
}

const resolutionConfigs: Record<Resolution, ResolutionConfig> = {
	"720p": { width: 1280, height: 720, frameRate: 30, bitrate: 2500000 },
	"1080p": { width: 1920, height: 1080, frameRate: 30, bitrate: 5000000 },
	"1440p": { width: 2560, height: 1440, frameRate: 30, bitrate: 8000000 },
	"4K": { width: 3840, height: 2160, frameRate: 30, bitrate: 16000000 },
	"8K": { width: 7680, height: 4320, frameRate: 30, bitrate: 40000000 },
	"custom": { width: 1920, height: 1080, frameRate: 30, bitrate: 5000000 },
};

export const useHighResSupport = () => {
	const state = reactive<HighResState>({
		supportedResolutions: [],
		currentResolution: "1080p",
		isSupported: false,
		performanceWarning: false,
	});

	const checkSupport = async (): Promise<Resolution[]> => {
		const supported: Resolution[] = [];

		// Check basic support
		if (!navigator.mediaDevices?.getDisplayMedia) {
			state.isSupported = false;
			return [];
		}

		// Check each resolution
		for (const [resolution, config] of Object.entries(resolutionConfigs)) {
			if (resolution === "custom") continue;

			try {
				const constraints = {
					video: {
						width: { ideal: config.width },
						height: { ideal: config.height },
						frameRate: { ideal: config.frameRate },
					},
					audio: false,
				};

				// Test if this resolution is supported
				const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
				stream.getTracks().forEach(track => track.stop());

				supported.push(resolution as Resolution);
			} catch {
				// Resolution not supported
			}
		}

		state.supportedResolutions = supported;
		state.isSupported = supported.length > 0;

		return supported;
	};

	const setResolution = (resolution: Resolution) => {
		if (!state.supportedResolutions.includes(resolution) && resolution !== "custom") {
			console.warn(`Resolution ${resolution} is not supported`);
			return;
		}

		state.currentResolution = resolution;

		// Check performance warning for high resolutions
		if (resolution === "4K" || resolution === "8K") {
			checkPerformanceWarning();
		}
	};

	const checkPerformanceWarning = () => {
		// Check available memory and CPU
		const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
		const cpuCores = navigator.hardwareConcurrency;

		if (state.currentResolution === "8K") {
			state.performanceWarning = !memory || memory < 8 || cpuCores < 4;
		} else if (state.currentResolution === "4K") {
			state.performanceWarning = !memory || memory < 4 || cpuCores < 2;
		} else {
			state.performanceWarning = false;
		}
	};

	const getConfig = (resolution?: Resolution): ResolutionConfig => {
		const res = resolution || state.currentResolution;
		return resolutionConfigs[res] || resolutionConfigs["1080p"];
	};

	const getMediaConstraints = (resolution?: Resolution): MediaStreamConstraints => {
		const config = getConfig(resolution);
		
		return {
			video: {
				width: { ideal: config.width },
				height: { ideal: config.height },
				frameRate: { ideal: config.frameRate },
			},
			audio: true,
		};
	};

	const estimateFileSize = (durationMinutes: number, resolution?: Resolution): number => {
		const config = getConfig(resolution);
		// ประมาณการ file size: bitrate * duration / 8
		const bytesPerSecond = config.bitrate / 8;
		const totalBytes = bytesPerSecond * durationMinutes * 60;
		return totalBytes;
	};

	const formatFileSize = (bytes: number): string => {
		const units = ["B", "KB", "MB", "GB", "TB"];
		let size = bytes;
		let unitIndex = 0;

		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}

		return `${size.toFixed(2)} ${units[unitIndex]}`;
	};

	const setCustomResolution = (width: number, height: number, frameRate: number) => {
		resolutionConfigs.custom = {
			width,
			height,
			frameRate,
			bitrate: estimateBitrate(width, height, frameRate),
		};
		state.currentResolution = "custom";
	};

	const estimateBitrate = (width: number, height: number, frameRate: number): number => {
		// ประมาณการ bitrate ตาม resolution และ frame rate
		const pixels = width * height;
		const baseBitrate = pixels * frameRate * 0.1; // 0.1 bits per pixel per frame
		return Math.min(baseBitrate, 80000000); // Max 80 Mbps
	};

	const getRecommendedResolution = (): Resolution => {
		const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
		const cpuCores = navigator.hardwareConcurrency;

		if (memory && memory >= 8 && cpuCores >= 4 && state.supportedResolutions.includes("4K")) {
			return "4K";
		}
		if (state.supportedResolutions.includes("1080p")) {
			return "1080p";
		}
		return state.supportedResolutions[0] || "720p";
	};

	const getDisplayInfo = () => {
		const config = getConfig();
		return {
			resolution: `${config.width}x${config.height}`,
			frameRate: config.frameRate,
			bitrate: `${(config.bitrate / 1000000).toFixed(1)} Mbps`,
			estimatedSizePerMinute: formatFileSize(estimateFileSize(1)),
		};
	};

	onMounted(() => {
		checkSupport();
	});

	return {
		state: readonly(state),
		supportedResolutions: computed(() => state.supportedResolutions),
		currentConfig: computed(() => getConfig()),
		checkSupport,
		setResolution,
		getConfig,
		getMediaConstraints,
		estimateFileSize,
		formatFileSize,
		setCustomResolution,
		getRecommendedResolution,
		getDisplayInfo,
	};
};
