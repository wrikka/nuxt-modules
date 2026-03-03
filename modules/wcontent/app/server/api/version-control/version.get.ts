import type { H3Event } from "h3";
import { createError, defineEventHandler, getQuery } from "h3";
import type { ContentVersion } from "../../../shared/types/version-control";
import { getContentVersionControl } from "../../utils/services/version-control";

export default defineEventHandler(async (event: H3Event) => {
	const query = getQuery(event);
	const contentPath = query.path as string;
	const versionNumber = query.version ? Number(query.version) : undefined;

	if (!contentPath) {
		throw createError({
			statusCode: 400,
			statusMessage: "Content path is required",
		});
	}

	const versionControl = getContentVersionControl();

	if (versionNumber) {
		const version = await versionControl.getVersion(contentPath, versionNumber);
		if (!version) {
			throw createError({
				statusCode: 404,
				statusMessage: "Version not found",
			});
		}
		return version as ContentVersion;
	}

	const currentVersion = await versionControl.getCurrentVersion(contentPath);
	if (!currentVersion) {
		throw createError({
			statusCode: 404,
			statusMessage: "No versions found",
		});
	}

	return currentVersion as ContentVersion;
});
