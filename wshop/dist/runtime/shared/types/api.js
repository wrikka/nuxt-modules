import { z } from "zod";
export const ApiResponseSchema = (dataSchema) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional()
  }).optional(),
  meta: z.object({
    total: z.number().optional(),
    page: z.number().optional(),
    limit: z.number().optional()
  }).optional()
});
export const PaginationQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional()
});
export const PaginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
});
