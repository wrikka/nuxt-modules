import { z } from "zod"

export const CategorySchema = z.object({
	id: z.number(),
	name: z.string().min(1, "Category name is required"),
	description: z.string().optional(),
	parentId: z.number().nullable(),
	image: z.string().optional(),
	isActive: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
})

export type Category = z.infer<typeof CategorySchema>

export type CategoryTree = Category & { children: CategoryTree[] }

export const CategoryTreeSchema: z.ZodType<CategoryTree> = CategorySchema.extend({
	children: z.lazy(() => CategoryTreeSchema.array()),
})
