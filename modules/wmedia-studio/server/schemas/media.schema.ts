import { z } from "zod";

// Media type enum
export const MediaTypeSchema = z.enum(["image", "audio", "video", "document"]);

// Create media item schema
export const CreateMediaSchema = z.object({
	name: z.string().min(1, "Name is required").max(255),
	type: MediaTypeSchema,
	url: z.string().url(),
	thumbnail: z.string().url().optional(),
	size: z.number().int().positive(),
	mimeType: z.string(),
	width: z.number().int().positive().optional(),
	height: z.number().int().positive().optional(),
	duration: z.number().positive().optional(),
	folderId: z.string().optional(),
	tags: z.array(z.string()).default([]),
	metadata: z.record(z.string(), z.unknown()).optional(),
});

// Update media item schema
export const UpdateMediaSchema = z.object({
	name: z.string().min(1).max(255).optional(),
	thumbnail: z.string().url().optional(),
	folderId: z.string().optional(),
	tags: z.array(z.string()).optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
});

// Media query parameters schema
export const MediaQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	sortBy: z.enum(["created", "updated", "name", "size"]).default("created"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
	type: MediaTypeSchema.optional(),
	folderId: z.string().optional(),
	search: z.string().optional(),
	tags: z.string().optional(), // Comma-separated tags
});

// Export types from schemas
export type CreateMediaInput = z.infer<typeof CreateMediaSchema>;
export type UpdateMediaInput = z.infer<typeof UpdateMediaSchema>;
export type MediaQuery = z.infer<typeof MediaQuerySchema>;
