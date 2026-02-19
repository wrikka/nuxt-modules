import type { H3Event } from "h3";
import { createError, defineEventHandler, readBody } from "h3";
import type { RollbackResult } from "../../../shared/types/version-control";
import { getContentVersionControl } from "../../utils/services/version-control";

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody(event);
	const { contentPath, versionNumber } = body;

	if (!contentPath || !versionNumber) {
		throw createError({
			statusCode: 400,
			statusMessage: "Content path and version number are required",
		});
	}

	const versionControl = getContentVersionControl();
	const result = await versionControl.rollback(contentPath, versionNumber);

	return result as RollbackResult;
});
