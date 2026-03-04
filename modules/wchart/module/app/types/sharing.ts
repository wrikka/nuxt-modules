import type { ChartData } from './chart';

/**
 * Social platform
 */
export type SocialPlatform =
	| "twitter"
	| "facebook"
	| "linkedin"
	| "instagram"
	| "pinterest"
	| "reddit"
	| "tumblr"
	| "telegram"
	| "whatsapp"
	| "email"
	| "copy-link";

/**
 * Sharing options
 */
export interface SharingOptions {
	title?: string;
	description?: string;
	hashtags?: string[];
	imageUrl?: string;
	chartData?: ChartData;
	customMessage?: string;
}

/**
 * Share result
 */
export interface ShareResult {
	success: boolean;
	platform: SocialPlatform;
	url?: string;
	error?: string;
}

/**
 * Embed options
 */
export interface EmbedOptions {
	width?: number | string;
	height?: number | string;
	responsive?: boolean;
	theme?: "light" | "dark";
	showTitle?: boolean;
	showLegend?: boolean;
	interactive?: boolean;
}
