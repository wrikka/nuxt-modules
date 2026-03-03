import { createError, defineEventHandler, readBody } from "h3";
import type { BackupResult } from "../../../shared/types/backup";
import { getContentBackupManager } from "../../utils/services/backup";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { contentPath, content, metadata } = body;

	if (!contentPath || !content) {
		throw createError({
			statusCode: 400,
			statusMessage: "Content path and content are required",
		});
	}

	const backupManager = getContentBackupManager();
	const result = await backupManager.createBackup(contentPath, content, metadata || {});

	return result as BackupResult;
});
