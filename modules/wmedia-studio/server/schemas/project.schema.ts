import { z } from "zod";

// Project type enum
export const ProjectTypeSchema = z.enum(["designer", "audio-editor", "video-editor", "video-recording"]);

// Project status enum
export const ProjectStatusSchema = z.enum(["draft", "active", "completed", "archived"]);

// Create project input schema
export const CreateProjectSchema = z.object({
	name: z.string().min(1, "Name is required").max(255),
	description: z.string().optional(),
	type: ProjectTypeSchema.default("designer"),
	width: z.number().int().positive().default(1920),
	height: z.number().int().positive().default(1080),
	backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").default("#ffffff"),
	folderId: z.string().optional(),
});

// Update project input schema (all fields optional)
export const UpdateProjectSchema = z.object({
	name: z.string().min(1).max(255).optional(),
	description: z.string().optional(),
	type: ProjectTypeSchema.optional(),
	status: ProjectStatusSchema.optional(),
	width: z.number().int().positive().optional(),
	height: z.number().int().positive().optional(),
	backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").optional(),
	folderId: z.string().optional(),
	thumbnail: z.string().optional(),
	elements: z.array(z.string()).optional(),
	tracks: z.any().optional(),
	timelineItems: z.any().optional(),
	duration: z.number().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	// Settings
	settingsSnapToGrid: z.boolean().optional(),
	settingsGridSize: z.number().int().positive().optional(),
	settingsShowGuides: z.boolean().optional(),
	settingsShowRulers: z.boolean().optional(),
	settingsAutoSave: z.boolean().optional(),
	settingsAutoSaveInterval: z.number().int().positive().optional(),
});

// Favorite project schema
export const FavoriteProjectSchema = z.object({
	isFavorite: z.boolean(),
});

// Tags update schema
export const UpdateProjectTagsSchema = z.object({
	tags: z.array(z.string()),
});

// Project query parameters schema
export const ProjectQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	sortBy: z.enum(["updated", "created", "name", "size"]).default("updated"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
	type: ProjectTypeSchema.optional(),
	status: ProjectStatusSchema.optional(),
	folderId: z.string().optional(),
	search: z.string().optional(),
	tags: z.string().optional(), // Comma-separated tags
	isFavorite: z.coerce.boolean().optional(),
	isDeleted: z.coerce.boolean().default(false),
});

// Export types from schemas
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type ProjectQuery = z.infer<typeof ProjectQuerySchema>;
