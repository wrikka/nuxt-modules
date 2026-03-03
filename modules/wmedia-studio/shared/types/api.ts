export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: ApiError;
	message?: string;
}

export interface ApiError {
	code: string;
	message: string;
	details?: Record<string, unknown>;
}

export interface PaginationParams {
	page: number;
	limit: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface UploadResponse {
	id: string;
	url: string;
	filename: string;
	size: number;
	mimeType: string;
}

export interface SocialMediaPlatform {
	id: string;
	name: string;
	icon: string;
	supportedFormats: string[];
	maxFileSize: number;
	maxCaptionLength?: number;
	dimensions?: {
		width: number;
		height: number;
	};
	requiresApproval?: boolean;
}

export interface PublishRequest {
	projectId: string;
	platform: string;
	caption?: string;
	tags?: string[];
	scheduleAt?: Date;
}

export interface PublishResponse {
	id: string;
	platform: string;
	url?: string;
	status: "pending" | "published" | "failed";
	publishedAt?: Date;
}

// Common HTTP Status Codes
export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500,
} as const;
