import { reactive, readonly, computed } from "vue";

export type SocialPlatform = "youtube" | "tiktok" | "instagram" | "facebook" | "twitter" | "linkedin" | "custom";

export interface PlatformSpecs {
	name: string;
	aspectRatio: "16:9" | "9:16" | "1:1" | "4:5";
	resolution: { width: number; height: number };
	maxDuration: number;
	maxFileSize: number;
	videoCodec: string;
	audioCodec: string;
}

export interface SocialExportJob {
	id: string;
	platform: SocialPlatform;
	videoBlob: Blob;
	status: "pending" | "processing" | "completed" | "failed";
	progress: number;
	resultUrl?: string;
	error?: string;
}

export interface SocialMediaExportState {
	platforms: Record<SocialPlatform, PlatformSpecs>;
	activeJobs: SocialExportJob[];
	defaultPlatform: SocialPlatform;
}

const PLATFORM_SPECS: Record<SocialPlatform, PlatformSpecs> = {
	youtube: {
		name: "YouTube",
		aspectRatio: "16:9",
		resolution: { width: 1920, height: 1080 },
		maxDuration: 43200,
		maxFileSize: 256 * 1024 * 1024 * 1024,
		videoCodec: "h264",
		audioCodec: "aac",
	},
	tiktok: {
		name: "TikTok",
		aspectRatio: "9:16",
		resolution: { width: 1080, height: 1920 },
		maxDuration: 600,
		maxFileSize: 287 * 1024 * 1024,
		videoCodec: "h264",
		audioCodec: "aac",
	},
	instagram: {
		name: "Instagram Reels",
		aspectRatio: "9:16",
		resolution: { width: 1080, height: 1920 },
		maxDuration: 90,
		maxFileSize: 4 * 1024 * 1024 * 1024,
		videoCodec: "h264",
		audioCodec: "aac",
	},
	facebook: {
		name: "Facebook",
		aspectRatio: "16:9",
		resolution: { width: 1280, height: 720 },
		maxDuration: 14400,
		maxFileSize: 10 * 1024 * 1024 * 1024,
		videoCodec: "h264",
		audioCodec: "aac",
	},
	twitter: {
		name: "Twitter/X",
		aspectRatio: "16:9",
		resolution: { width: 1920, height: 1080 },
		maxDuration: 140,
		maxFileSize: 512 * 1024 * 1024,
		videoCodec: "h264",
		audioCodec: "aac",
	},
	linkedin: {
		name: "LinkedIn",
		aspectRatio: "16:9",
		resolution: { width: 1920, height: 1080 },
		maxDuration: 600,
		maxFileSize: 5 * 1024 * 1024 * 1024,
		videoCodec: "h264",
		audioCodec: "aac",
	},
	custom: {
		name: "Custom",
		aspectRatio: "16:9",
		resolution: { width: 1920, height: 1080 },
		maxDuration: Infinity,
		maxFileSize: Infinity,
		videoCodec: "h264",
		audioCodec: "aac",
	},
};

export const useSocialMediaExport = () => {
	const state = reactive<SocialMediaExportState>({
		platforms: PLATFORM_SPECS,
		activeJobs: [],
		defaultPlatform: "youtube",
	});

	const exportForPlatform = async (videoBlob: Blob, platform: SocialPlatform): Promise<SocialExportJob> => {
		const job: SocialExportJob = {
			id: `export-${Date.now()}`,
			platform,
			videoBlob,
			status: "processing",
			progress: 0,
		};

		state.activeJobs.push(job);

		const specs = state.platforms[platform];

		// Check file size
		if (videoBlob.size > specs.maxFileSize) {
			job.status = "failed";
			job.error = `File too large. Max size: ${formatBytes(specs.maxFileSize)}`;
			return job;
		}

		try {
			// Simulate processing
			for (let i = 0; i <= 100; i += 10) {
				job.progress = i;
				await new Promise(resolve => setTimeout(resolve, 100));
			}

			// In production, this would transcode the video to platform specs
			job.status = "completed";
			job.resultUrl = URL.createObjectURL(videoBlob);
		} catch (error) {
			job.status = "failed";
			job.error = error instanceof Error ? error.message : "Export failed";
		}

		return job;
	};

	const formatBytes = (bytes: number): string => {
		if (bytes === Infinity) return "Unlimited";
		const units = ["B", "KB", "MB", "GB", "TB"];
		let size = bytes;
		let unitIndex = 0;
		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}
		return `${size.toFixed(2)} ${units[unitIndex]}`;
	};

	const getPlatformSpecs = (platform: SocialPlatform): PlatformSpecs => {
		return state.platforms[platform];
	};

	const getRecommendedSettings = (platform: SocialPlatform) => {
		const specs = state.platforms[platform];
		const [w, h] = specs.aspectRatio.split(":").map(Number);

		return {
			width: specs.resolution.width,
			height: specs.resolution.height,
			aspectRatio: w / h,
			maxDuration: specs.maxDuration,
			maxFileSize: specs.maxFileSize,
		};
	};

	const setDefaultPlatform = (platform: SocialPlatform) => {
		state.defaultPlatform = platform;
	};

	const clearCompletedJobs = () => {
		state.activeJobs = state.activeJobs.filter(j => j.status === "processing" || j.status === "pending");
	};

	return {
		state: readonly(state),
		exportForPlatform,
		getPlatformSpecs,
		getRecommendedSettings,
		setDefaultPlatform,
		clearCompletedJobs,
	};
};
