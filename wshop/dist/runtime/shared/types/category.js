import { z } from "zod";
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  parentId: z.number().nullable(),
  image: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});
export const CategoryTreeSchema = CategorySchema.extend({
  children: z.lazy(() => CategoryTreeSchema.array())
});
