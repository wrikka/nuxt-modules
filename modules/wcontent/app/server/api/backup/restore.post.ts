import { createError, defineEventHandler, readBody } from "h3";
import type { RestoreResult } from "../../../shared/types/backup";
import { getContentBackupManager } from "../../utils/services/backup";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { contentPath, backupId } = body;

	if (!contentPath || !backupId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Content path and backup ID are required",
		});
	}

	const backupManager = getContentBackupManager();
	const result = await backupManager.restoreBackup(contentPath, backupId);

	return result as RestoreResult;
});
