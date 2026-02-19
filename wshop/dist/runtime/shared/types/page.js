import { z } from "zod";
export const PageBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.any())
});
export const PageSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.array(PageBlockSchema),
  status: z.enum(["draft", "published"]),
  locale: z.string(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});
