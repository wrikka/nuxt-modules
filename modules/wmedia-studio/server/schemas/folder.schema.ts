import { z } from "zod";

// Create folder schema
export const CreateFolderSchema = z.object({
	name: z.string().min(1, "Name is required").max(255),
	parentId: z.string().optional(),
	order: z.number().int().default(0),
});

// Update folder schema
export const UpdateFolderSchema = z.object({
	name: z.string().min(1).max(255).optional(),
	parentId: z.string().optional(),
	order: z.number().int().optional(),
});

// Export types from schemas
export type CreateFolderInput = z.infer<typeof CreateFolderSchema>;
export type UpdateFolderInput = z.infer<typeof UpdateFolderSchema>;
