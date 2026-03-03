import { z } from "zod"

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		success: z.boolean(),
		data: dataSchema.optional(),
		error: z.object({
			code: z.string(),
			message: z.string(),
			details: z.unknown().optional(),
		}).optional(),
		meta: z.object({
			total: z.number().optional(),
			page: z.number().optional(),
			limit: z.number().optional(),
		}).optional(),
	})

export type ApiResponse<T> = z.infer<ReturnType<typeof ApiResponseSchema<z.ZodType<T>>>>

export const PaginationQuerySchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
	sort: z.string().optional(),
	order: z.enum(["asc", "desc"]).optional(),
})
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>

export const PaginationMetaSchema = z.object({
	total: z.number(),
	page: z.number(),
	limit: z.number(),
	totalPages: z.number(),
})
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>
