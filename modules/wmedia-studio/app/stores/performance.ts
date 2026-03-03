import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface PerformanceMetrics {
	fps: number;
	frameTime: number;
	memoryUsage: number;
	gpuMemory?: number;
	droppedFrames: number;
	totalFrames: number;
}

export interface ProxySettings {
	enabled: boolean;
	resolution: "1/2" | "1/4" | "1/8";
	format: "h264" | "prores" | "dnxhd";
}

export interface CacheSettings {
	maxMemoryMB: number;
	maxDiskGB: number;
	textureCacheSize: number;
	frameCacheSize: number;
}

export const usePerformanceStore = defineStore("performance", () => {
	const metrics = ref<PerformanceMetrics>({
		fps: 30,
		frameTime: 33.33,
		memoryUsage: 0,
		droppedFrames: 0,
		totalFrames: 0,
	});

	const proxySettings = ref<ProxySettings>({
		enabled: false,
		resolution: "1/2",
		format: "h264",
	});

	const cacheSettings = ref<CacheSettings>({
		maxMemoryMB: 2048,
		maxDiskGB: 10,
		textureCacheSize: 512,
		frameCacheSize: 100,
	});

	const isUsingProxy = ref(false);
	const currentResolution = ref<"full" | "half" | "quarter" | "eighth">("full");

	const frameTimeHistory = ref<number[]>([]);
	const maxFrameTimeHistory = 60;

	const averageFps = computed(() => {
		if (frameTimeHistory.value.length === 0) return 30;
		const avgFrameTime = frameTimeHistory.value.reduce((a, b) => a + b, 0) / frameTimeHistory.value.length;
		return Math.round(1000 / avgFrameTime);
	});

	const updateMetrics = (newMetrics: Partial<PerformanceMetrics>) => {
		Object.assign(metrics.value, newMetrics);

		if (newMetrics.frameTime) {
			frameTimeHistory.value.push(newMetrics.frameTime);
			if (frameTimeHistory.value.length > maxFrameTimeHistory) {
				frameTimeHistory.value.shift();
			}
		}
	};

	const enableProxyMode = (resolution: ProxySettings["resolution"] = "1/2") => {
		proxySettings.value.enabled = true;
		proxySettings.value.resolution = resolution;
		isUsingProxy.value = true;

		switch (resolution) {
			case "1/2":
				currentResolution.value = "half";
				break;
			case "1/4":
				currentResolution.value = "quarter";
				break;
			case "1/8":
				currentResolution.value = "eighth";
				break;
		}
	};

	const disableProxyMode = () => {
		proxySettings.value.enabled = false;
		isUsingProxy.value = false;
		currentResolution.value = "full";
	};

	const getOptimalResolution = (sourceWidth: number, sourceHeight: number): { width: number; height: number } => {
		const scale = {
			full: 1,
			half: 0.5,
			quarter: 0.25,
			eighth: 0.125,
		}[currentResolution.value];

		return {
			width: Math.round(sourceWidth * scale),
			height: Math.round(sourceHeight * scale),
		};
	};

	const estimateMemoryUsage = (width: number, height: number, fps: number, duration: number): number => {
		// Rough estimate: width * height * 4 bytes per pixel * fps * duration
		const frameSize = width * height * 4;
		const totalFrames = fps * duration;
		return (frameSize * totalFrames) / (1024 * 1024); // Convert to MB
	};

	const shouldUseProxy = (width: number, height: number): boolean => {
		// Auto-enable proxy for 4K+ footage
		if (width >= 3840 || height >= 2160) {
			return true;
		}
		// Check if memory usage would exceed limit
		const estimatedMemory = estimateMemoryUsage(width, height, 30, 60);
		return estimatedMemory > cacheSettings.value.maxMemoryMB * 0.5;
	};

	const clearCache = () => {
		// Clear video and image caches
		// This would be called from useVideoPreview
	};

	const optimizeFor4K = () => {
		// Enable proxy mode with 1/4 resolution for 4K footage
		enableProxyMode("1/4");
		// Reduce cache sizes
		cacheSettings.value.frameCacheSize = 50;
		cacheSettings.value.textureCacheSize = 256;
	};

	const resetToDefaults = () => {
		proxySettings.value = {
			enabled: false,
			resolution: "1/2",
			format: "h264",
		};
		cacheSettings.value = {
			maxMemoryMB: 2048,
			maxDiskGB: 10,
			textureCacheSize: 512,
			frameCacheSize: 100,
		};
		isUsingProxy.value = false;
		currentResolution.value = "full";
		frameTimeHistory.value = [];
	};

	return {
		metrics,
		proxySettings,
		cacheSettings,
		isUsingProxy,
		currentResolution,
		frameTimeHistory,
		averageFps,
		updateMetrics,
		enableProxyMode,
		disableProxyMode,
		getOptimalResolution,
		shouldUseProxy,
		clearCache,
		optimizeFor4K,
		resetToDefaults,
	};
});
