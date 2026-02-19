import { createError, defineEventHandler, getQuery } from "h3";
import { getContentBackupManager } from "../../utils/services/backup";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const contentPath = query.path as string;
	const backupId = query.id as string;

	if (!contentPath || !backupId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Content path and backup ID are required",
		});
	}

	const backupManager = getContentBackupManager();
	const success = await backupManager.deleteBackup(contentPath, backupId);

	return { success };
});
