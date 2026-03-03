import { z } from "zod";

// Template category enum
export const TemplateCategorySchema = z.enum([
	"social-media",
	"presentation",
	"poster",
	"flyer",
	"brochure",
	"banner",
	"infographic",
	"card",
	"certificate",
	"resume",
	"other",
]);

// Template query parameters schema
export const TemplateQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	category: TemplateCategorySchema.optional(),
	search: z.string().optional(),
	tags: z.string().optional(), // Comma-separated tags
	isPremium: z.coerce.boolean().optional(),
	sortBy: z.enum(["created", "updated", "rating", "usageCount"]).default("created"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Export types from schemas
export type TemplateQuery = z.infer<typeof TemplateQuerySchema>;
