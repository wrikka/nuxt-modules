import type { H3Event } from "h3";
import { z } from "zod";

/**
 * Validate request body against a Zod schema
 */
export async function validateBody<T extends z.ZodType>(
	event: H3Event,
	schema: T,
): Promise<z.infer<T>> {
	try {
		const body = await readBody(event);
		return schema.parse(body);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw createError({
				statusCode: 422,
				statusMessage: "Validation Error",
				data: {
					errors: error.issues.map((err) => ({
						field: err.path.join("."),
						message: err.message,
					})),
				},
			});
		}
		throw error;
	}
}

/**
 * Validate query parameters against a Zod schema
 */
export function validateQuery<T extends z.ZodType>(
	event: H3Event,
	schema: T,
): z.infer<T> {
	try {
		const query = getQuery(event);
		return schema.parse(query);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw createError({
				statusCode: 422,
				statusMessage: "Validation Error",
				data: {
					errors: error.issues.map((err) => ({
						field: err.path.join("."),
						message: err.message,
					})),
				},
			});
		}
		throw error;
	}
}

/**
 * Validate route parameters against a Zod schema
 */
export function validateParams<T extends z.ZodType>(
	event: H3Event,
	schema: T,
): z.infer<T> {
	try {
		const params = event.context.params || {};
		return schema.parse(params);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw createError({
				statusCode: 422,
				statusMessage: "Validation Error",
				data: {
					errors: error.issues.map((err) => ({
						field: err.path.join("."),
						message: err.message,
					})),
				},
			});
		}
		throw error;
	}
}
