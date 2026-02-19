import { createError, defineEventHandler, readBody } from "h3";
import type { H3Event } from "h3";
import type { ContentVersion } from "../../../shared/types/version-control";
import { getContentVersionControl } from "../../utils/services/version-control";

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody(event);
	const { contentPath, content, metadata, authorId, authorName, changeDescription } = body;

	if (!contentPath || !content || !authorId || !authorName) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing required fields",
		});
	}

	const versionControl = getContentVersionControl();
	const version = await versionControl.createVersion(
		contentPath,
		content,
		metadata || {},
		authorId,
		authorName,
		changeDescription,
	);

	return version as ContentVersion;
});
