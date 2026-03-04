import { ref, computed, readonly } from "vue";
import type { ChartData } from '@/module/app/types/chart-basic';
import type {
	SocialPlatform,
	SharingOptions,
	ShareResult,
	EmbedOptions,
} from "../types/sharing";
import {
	shareToTwitter,
	shareToFacebook,
	shareToLinkedIn,
	shareToReddit,
	shareToTelegram,
	shareToWhatsApp,
	shareToEmail,
	copyToClipboard,
} from "../utils/sharing-utils";

/**
 * Composable for chart sharing and social features
 */
export function useChartSharing(chartData?: ChartData) {
	const currentChartData = ref<ChartData | undefined>(chartData);
	const isSharing = ref(false);
	const shareResults = ref<ShareResult[]>([]);

	/**
	 * Update chart data for sharing
	 */
	const setChartData = (data: ChartData) => {
		currentChartData.value = data;
	};

	/**
	 * Share chart on social platform
	 */
	const shareOnPlatform = async (
		platform: SocialPlatform,
		options: SharingOptions = {},
	): Promise<ShareResult> => {
		isSharing.value = true;

		try {
			const result = await shareToPlatform(platform, options);
			shareResults.value.push(result);
			return result;
		} catch (error) {
			const errorResult: ShareResult = {
				success: false,
				platform,
				error: error instanceof Error ? error.message : "Unknown error",
			};
			shareResults.value.push(errorResult);
			return errorResult;
		} finally {
			isSharing.value = false;
		}
	};

	/**
	 * Share to specific platform
	 */
	const shareToPlatform = async (
		platform: SocialPlatform,
		options: SharingOptions,
	): Promise<ShareResult> => {
		const {
			title = "Interactive Chart",
			description = "Check out this interactive chart",
			hashtags = ["chart", "data", "visualization"],
			customMessage,
		} = options;

		const message = customMessage || `${title}\n\n${description}`;
		const url = generateShareUrl(platform, message, hashtags, options);

		switch (platform) {
			case "twitter":
				return shareToTwitter(message, hashtags, url);
			case "facebook":
				return shareToFacebook(message, url);
			case "linkedin":
				return shareToLinkedIn(message, url);
			case "reddit":
				return shareToReddit(title, message, url);
			case "telegram":
				return shareToTelegram(message, url);
			case "whatsapp":
				return shareToWhatsApp(message, url);
			case "email":
				return shareToEmail(title, message, url);
			case "copy-link":
				return copyToClipboard(url);
			default:
				throw new Error(`Unsupported platform: ${platform}`);
		}
	};

	/**
	 * Generate share URL for platform
	 */
	const generateShareUrl = (
		platform: SocialPlatform,
		message: string,
		hashtags: string[],
		options: SharingOptions,
	): string => {
		// In a real implementation, this would generate a hosted URL for the chart
		// For now, return a placeholder
		const baseUrl = window.location.origin;
		const chartId = `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		return `${baseUrl}/shared-chart/${chartId}`;
	};

	/**
	 * Generate embed code
	 */
	const generateEmbedCode = (options: EmbedOptions = {}): string => {
		const {
			width = "100%",
			height = 400,
			responsive = true,
			theme = "light",
			showTitle = true,
			showLegend = true,
			interactive = true,
		} = options;

		const chartId = `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const embedUrl = `${window.location.origin}/embed/${chartId}`;

		const iframe = `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;

		if (responsive) {
			return `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
</div>`;
		}

		return iframe;
	};

	/**
	 * Generate social media image
	 */
	const generateSocialImage = async (
		chartData: ChartData,
		options: { width?: number; height?: number } = {},
	): Promise<string> => {
		const { width = 1200, height = 630 } = options;

		// In a real implementation, this would render the chart to canvas and convert to image
		// For now, return a placeholder
		console.warn(
			"Social image generation not fully implemented - returning placeholder",
		);
		return `data:image/svg+xml;base64,${btoa('<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="48">Chart Preview</text></svg>')}`;
	};

	/**
	 * Get supported platforms
	 */
	const getSupportedPlatforms = (): SocialPlatform[] => {
		return [
			"twitter",
			"facebook",
			"linkedin",
			"reddit",
			"telegram",
			"whatsapp",
			"email",
			"copy-link",
		];
	};

	/**
	 * Get share statistics
	 */
	const getShareStats = () => {
		const totalShares = shareResults.value.length;
		const successfulShares = shareResults.value.filter((r) => r.success).length;
		const platformStats = shareResults.value.reduce(
			(acc, result) => {
				acc[result.platform] = (acc[result.platform] || 0) + 1;
				return acc;
			},
			{} as Record<SocialPlatform, number>,
		);

		return {
			totalShares,
			successfulShares,
			failedShares: totalShares - successfulShares,
			platformStats,
		};
	};

	/**
	 * Clear share results
	 */
	const clearShareResults = () => {
		shareResults.value = [];
	};

	/**
	 * Quick share with default options
	 */
	const quickShare = async (
		platforms: SocialPlatform[],
		options: SharingOptions = {},
	): Promise<ShareResult[]> => {
		const results = await Promise.all(
			platforms.map((platform) => shareOnPlatform(platform, options)),
		);
		return results;
	};

	return {
		// State
		currentChartData: readonly(currentChartData),
		isSharing: readonly(isSharing),
		shareResults: readonly(shareResults),

		// Methods
		setChartData,
		shareOnPlatform,
		generateEmbedCode,
		generateSocialImage,
		getSupportedPlatforms,
		getShareStats,
		clearShareResults,
		quickShare,
	};
}
