import type { ApiResponse, PaginationMeta } from "~/shared/types"

export function createSuccessResponse<T>(
	data: T,
	meta?: PaginationMeta,
): ApiResponse<T> {
	return {
		success: true,
		data,
		meta: meta
			? {
				total: meta.total,
				limit: meta.limit,
				page: meta.page,
				totalPages: meta.totalPages,
			}
			: undefined,
	}
}

export function createErrorResponse<T = unknown>(
	code: string,
	message: string,
	details?: unknown,
): ApiResponse<T> {
	return {
		success: false,
		error: {
			code,
			message,
			details,
		},
	}
}

export function getPaginationMeta(
	total: number,
	page: number,
	limit: number,
): PaginationMeta {
	return {
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit),
	}
}
