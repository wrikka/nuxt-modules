export interface AIRequest {
	type: AIRequestType;
	data: unknown;
}

export type AIRequestType =
	| "template-search"
	| "magic-resize"
	| "background-remover"
	| "layout-suggestion"
	| "color-palette"
	| "content-generation"
	| "image-upscale";

export interface AITemplateSearchRequest {
	query: string;
	category?: string;
	style?: string;
	tags?: string[];
}

export interface AIMagicResizeRequest {
	projectId: string;
	targetWidth: number;
	targetHeight: number;
}

export interface AIBackgroundRemoverRequest {
	imageId: string;
}

export interface AILayoutSuggestionRequest {
	elements: string[];
	width: number;
	height: number;
	style?: string;
}

export interface AIColorPaletteRequest {
	baseColor?: string;
	imageId?: string;
	mood?: string;
	count?: number;
}

export interface AIContentGenerationRequest {
	type: "text" | "image";
	prompt: string;
	style?: string;
	options?: Record<string, unknown>;
}

export interface AIImageUpscaleRequest {
	imageId: string;
	scale: 2 | 4;
}

export interface AIResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface AITemplateSearchResponse {
	templates: string[];
	confidence: number;
}

export interface AIMagicResizeResponse {
	projectId: string;
	elements: string[];
}

export interface AIBackgroundRemoverResponse {
	imageId: string;
	url: string;
}

export interface AILayoutSuggestionResponse {
	elements: string[];
	confidence: number;
}

export interface AIColorPaletteResponse {
	colors: string[];
	name: string;
}

export interface AIContentGenerationResponse {
	content: string;
	url?: string;
}

export interface AIImageUpscaleResponse {
	imageId: string;
	url: string;
}

export interface AIChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

export interface AIChatContext {
	projectId: string;
	currentSelection?: string[];
	currentPage?: string;
}
