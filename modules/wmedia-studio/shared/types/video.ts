import type { TransformProperties } from "./project";

/**
 * Video-related type definitions
 */

export interface VideoTransition {
	type: "fade" | "dissolve";
	duration: number;
}

export interface ColorCorrection {
	brightness: number; // -100 to 100
	contrast: number; // -100 to 100
	saturation: number; // -100 to 100
}

export interface ColorWheel {
	hue: number; // 0 to 360
	saturation: number; // 0 to 100
	value: number; // -100 to 100
}

export interface CurvesPoint {
	x: number; // 0 to 255
	y: number; // 0 to 255
}

export interface ColorCurves {
	rgb: CurvesPoint[];
	red: CurvesPoint[];
	green: CurvesPoint[];
	blue: CurvesPoint[];
	luma: CurvesPoint[];
}

export interface ColorGrading {
	enabled: boolean;
	wheels: {
		shadows: ColorWheel;
		midtones: ColorWheel;
		highlights: ColorWheel;
	};
	curves: ColorCurves;
	temperature: number; // -100 to 100
	tint: number; // -100 to 100
	vibrance: number; // -100 to 100
}

export interface MediaAsset {
	id: string;
	name: string;
	type: "video" | "audio" | "image";
	url: string;
	thumbnailUrl?: string;
	duration?: number; // for video/audio
	fileSize?: number;
	createdAt: Date;
	tags?: string[];
}

export interface Caption {
	id: number;
	startTime: number;
	endTime: number;
	text: string;
	clipId?: string; // Associated clip
}

export interface VideoTrack {
	id: string;
	type: "video" | "audio" | "text";
	name: string;
	locked: boolean;
	visible: boolean;
	volume?: number;
}

export interface VideoClip {
	id: string;
	trackId: string;
	startTime: number;
	endTime: number;
	duration: number;
	sourceUrl: string;
	type: "video" | "audio" | "text" | "image";
	name: string;
	thumbnailUrl?: string;
	transform?: TransformProperties;
	effects?: string[];
	transitionIn?: VideoTransition;
	transitionOut?: VideoTransition;
	colorCorrection?: ColorCorrection;
	colorGrading?: ColorGrading;
	audioSettings?: {
		volume: number;
		fadeIn: number;
		fadeOut: number;
		muted: boolean;
		noiseReduction?: {
			enabled: boolean;
			strength: number; // 0-100
			processedUrl?: string;
		};
	};
}

export interface VideoProject {
	id: string;
	name: string;
	description?: string;
	width: number;
	height: number;
	fps: number;
	duration: number;
	tracks: VideoTrack[];
	clips: VideoClip[];
	mediaAssets: MediaAsset[];
	captions: Caption[];
	settings: {
		backgroundColor?: string;
		audioVolume: number;
	};
	createdAt: Date;
	updatedAt: Date;
}
