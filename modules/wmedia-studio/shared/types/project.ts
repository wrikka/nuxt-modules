export type ProjectType = "designer" | "audio-editor" | "video-editor" | "video-recording";

export type ProjectStatus = "draft" | "active" | "completed" | "archived";

export interface Keyframe {
	id: string;
	time: number; // Time relative to the item's start time (0 to item.duration)
	value: number;
	easing: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

export type AnimatableProperty = "x" | "y" | "scale" | "rotation" | "opacity";

export interface TransformProperties {
	x: Keyframe[];
	y: Keyframe[];
	scale: Keyframe[];
	rotation: Keyframe[];
	opacity: Keyframe[];
}

export interface TimelineTrack {
	id: string;
	name: string;
	locked: boolean;
	visible: boolean;
}

export type TimelineItemType = "video" | "audio" | "text" | "image" | "design-element";

export interface TimelineItem {
	id: string;
	trackId: string;
	startTime: number;
	endTime: number;
	duration: number;
	type: TimelineItemType;
	name: string;
	sourceUrl?: string;
	thumbnailUrl?: string;
	transform?: TransformProperties;
	effects?: string[];
	audioSettings?: {
		volume: number;
		fadeIn: number;
		fadeOut: number;
		muted: boolean;
	};
	// For design elements, this could be the element ID
	elementId?: string;
	// Video transitions
	transitionIn?: {
		type: string;
		duration: number;
	};
	transitionOut?: {
		type: string;
		duration: number;
	};
}

export interface DesignerSnapshot {
	version: number;
	schemaVersion: number;
	timestamp: number;
	json: string;
}

export interface Project {
	id: string;
	name: string;
	description?: string;
	thumbnail?: string;
	elements: string[];
	width: number;
	height: number;
	backgroundColor: string;
	createdAt: Date;
	updatedAt: Date;
	lastModifiedBy?: string;
	folderId?: string;
	isTemplate: boolean;
	version: number;
	settings: ProjectSettings;
	type?: ProjectType;
	status?: ProjectStatus;
	createdBy?: string;
	metadata?: Record<string, unknown>;
	duration: number;
	tracks: TimelineTrack[];
	timelineItems: TimelineItem[];
	// New fields
	isFavorite?: boolean;
	isDeleted?: boolean;
	deletedAt?: Date;
	size?: number;
	tags?: string[];
	sharedWith?: { userId: string; role: string }[];
}

export interface ProjectSettings {
	width: number;
	height: number;
	snapToGrid: boolean;
	gridSize: number;
	showGuides: boolean;
	showRulers: boolean;
	autoSave: boolean;
	autoSaveInterval: number;
}

export interface Folder {
	id: string;
	name: string;
	parentId?: string;
	createdAt: Date;
	updatedAt: Date;
	order: number;
}

export interface ProjectHistory {
	id: string;
	projectId: string;
	version: number;
	elements: string[];
	createdAt: Date;
	createdBy?: string;
	description?: string;
}

export interface ExportOptions {
	format: "png" | "jpg" | "pdf" | "svg" | "mp4";
	quality: number;
	scale: number;
	transparent: boolean;
	width?: number;
	height?: number;
}

export interface ExportResult {
	url: string;
	size: number;
	format: string;
}

export interface ProjectShare {
	id: string;
	projectId: string;
	userId: string;
	role: "owner" | "admin" | "editor" | "viewer";
	createdAt: Date;
}

export interface ProjectExport {
	id: string;
	projectId: string;
	format: "json" | "pdf" | "png" | "mp4" | "wav" | "mp3";
	status: "pending" | "processing" | "completed" | "failed";
	url?: string;
	createdAt: Date;
	completedAt?: Date;
}
