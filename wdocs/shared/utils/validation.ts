import { z } from "zod";

// Types and validation
export type ValidationError = Error;
export type Frontmatter = Record<string, unknown>;
export interface Heading {
	level: number;
	text: string;
	id: string;
}
export interface PageData {
	title: string;
	description?: string;
	frontmatter: Frontmatter;
	headings: Heading[];
}
export interface ContentItem {
	id: string;
	content: string;
	meta: Frontmatter;
}
export interface MarkdownApiResponse {
	html: string;
	headings: Heading[];
}
export interface PageContent {
	html: string;
	toc: Heading[];
	frontmatter: Frontmatter;
}
export interface SearchResult {
	id: string;
	title: string;
	content: string;
	score: number;
}

// Stub validation functions
export function validateFrontmatter(data: unknown): Frontmatter {
	return data as Frontmatter;
}

export function validatePageData(data: unknown): PageData {
	return data as PageData;
}

export function validateContentItem(data: unknown): ContentItem {
	return data as ContentItem;
}

export function validateHeading(data: unknown): Heading {
	return data as Heading;
}

export function validateWDocsConfig(data: unknown): WDocsConfig {
	const result = z.object({
		sidebar: z.record(z.string(), z.any()),
		editPage: z.object({
			repo: z.string(),
			branch: z.string(),
			dir: z.string(),
			text: z.string(),
		}).optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		socials: z.record(z.string(), z.string()).optional(),
		header: z.object({
			nav: z.array(z.any()),
			logo: z.boolean().optional(),
		}).optional(),
		footer: z.object({
			message: z.string().optional(),
			copyright: z.string().optional(),
		}).optional(),
		theme: z.record(z.string(), z.string()).optional(),
	}).safeParse(data);

	if (!result.success) {
		throw new Error("Invalid WDocs config"); // Simplified error handling
	}

	return result.data as WDocsConfig;
}

export function validateNavItem(data: unknown): NavItem {
	const result = z.object({
		text: z.string(),
		link: z.string().optional(),
		children: z.array(z.any()).optional(),
		items: z.array(z.any()).optional(),
		method: z.string().optional(),
		name: z.string().optional(),
		order: z.number().optional(),
		icon: z.string().optional(),
	}).safeParse(data);

	if (!result.success) {
		throw new Error("Invalid nav item"); // Simplified error handling
	}

	return result.data as NavItem;
}

export function validateApiParameter(data: unknown): ApiParameter {
	const result = z.object({
		name: z.string(),
		in: z.enum(["query", "header", "path", "cookie"]),
		description: z.string(),
		required: z.boolean().optional(),
		schema: z.object({
			type: z.string(),
			default: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
		}),
	}).safeParse(data);

	if (!result.success) {
		throw new Error("Invalid API parameter"); // Simplified error handling
	}

	return result.data as ApiParameter;
}

export function validateApiResponse(data: unknown): ApiResponse {
	const result = z.object({
		description: z.string(),
	}).safeParse(data);

	if (!result.success) {
		throw new Error("Invalid API response"); // Simplified error handling
	}

	return result.data as ApiResponse;
}
