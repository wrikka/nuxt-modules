export type MediaType = "image" | "audio" | "video" | "document";

export interface MediaItem {
	id: string;
	name: string;
	type: MediaType;
	url: string;
	thumbnail?: string;
	size: number;
	mimeType: string;
	width?: number;
	height?: number;
	duration?: number;
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
	uploadedBy: string;
	folderId?: string;
	metadata?: Record<string, unknown>;
}

export interface MediaFolder {
	id: string;
	name: string;
	parentId?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface MediaUploadOptions {
	folderId?: string;
	tags?: string[];
	metadata?: Record<string, unknown>;
}

export interface MediaFilter {
	type?: MediaType;
	folderId?: string;
	tags?: string[];
	search?: string;
	dateFrom?: Date;
	dateTo?: Date;
}
