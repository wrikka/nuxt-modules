import { createError, defineEventHandler, getQuery } from "h3";
import type { BackupList } from "../../../shared/types/backup";
import { getContentBackupManager } from "../../utils/services/backup";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const contentPath = query.path as string;

	if (!contentPath) {
		throw createError({
			statusCode: 400,
			statusMessage: "Content path is required",
		});
	}

	const backupManager = getContentBackupManager();
	const list = await backupManager.getBackupList(contentPath);

	return list as BackupList;
});
