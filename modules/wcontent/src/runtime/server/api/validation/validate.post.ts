import { createError, defineEventHandler, readBody } from "h3";
import type { ValidationResult } from "../../../shared/types/validation";
import { getContentValidator } from "../../utils/services/validation";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { content, options } = body;

	if (!content) {
		throw createError({
			statusCode: 400,
			statusMessage: "Content is required",
		});
	}

	const validator = getContentValidator();
	const result = await validator.validate(content, options || {});

	return result as ValidationResult;
});
