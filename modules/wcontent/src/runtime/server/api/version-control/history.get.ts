import type { H3Event } from "h3";
import { createError, defineEventHandler, getQuery } from "h3";
import type { VersionHistory } from "../../../shared/types/version-control";
import { getContentVersionControl } from "../../utils/services/version-control";

export default defineEventHandler(async (event: H3Event) => {
	const query = getQuery(event);
	const contentPath = query.path as string;

	if (!contentPath) {
		throw createError({
			statusCode: 400,
			statusMessage: "Content path is required",
		});
	}

	const versionControl = getContentVersionControl();
	const history = await versionControl.getVersionHistory(contentPath);

	return history as VersionHistory;
});
