import { HTTP_STATUS } from "#shared/types/api";

/**
 * Create a standardized success response
 */
export function successResponse<T>(data: T) {
	return { data };
}

/**
 * Create a standardized error response with bad request status
 */
export function badRequest(message: string, errors?: Array<{ field: string; message: string }>) {
	return createError({
		statusCode: HTTP_STATUS.BAD_REQUEST,
		statusMessage: "Bad Request",
		message,
		data: errors ? { errors } : undefined,
	});
}

/**
 * Create a standardized error response with not found status
 */
export function notFound(resource: string, id?: string) {
	return createError({
		statusCode: HTTP_STATUS.NOT_FOUND,
		statusMessage: "Not Found",
		message: id ? `${resource} with ID "${id}" not found` : `${resource} not found`,
	});
}

/**
 * Create a standardized error response with server error status
 */
export function serverError(message: string = "Internal server error") {
	return createError({
		statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
		statusMessage: "Internal Server Error",
		message,
	});
}

/**
 * Create a standardized error response with unauthorized status
 */
export function unauthorized(message: string = "Unauthorized") {
	return createError({
		statusCode: HTTP_STATUS.UNAUTHORIZED,
		statusMessage: "Unauthorized",
		message,
	});
}

/**
 * Create a standardized error response with forbidden status
 */
export function forbidden(message: string = "Forbidden") {
	return createError({
		statusCode: HTTP_STATUS.FORBIDDEN,
		statusMessage: "Forbidden",
		message,
	});
}

/**
 * Create a standardized error response with conflict status
 */
export function conflict(message: string) {
	return createError({
		statusCode: HTTP_STATUS.CONFLICT,
		statusMessage: "Conflict",
		message,
	});
}
