import type { BackupList, BackupResult, RestoreResult } from "../../shared/types/backup";

export function useBackup() {
	const createBackup = async (
		contentPath: string,
		content: string,
		metadata: Record<string, any>,
	): Promise<BackupResult> => {
		const response = await $fetch("/api/backup/create", {
			method: "POST",
			body: { contentPath, content, metadata },
		});
		return response as BackupResult;
	};

	const restoreBackup = async (contentPath: string, backupId: string): Promise<RestoreResult> => {
		const response = await $fetch("/api/backup/restore", {
			method: "POST",
			body: { contentPath, backupId },
		});
		return response as RestoreResult;
	};

	const getBackupList = async (contentPath: string): Promise<BackupList> => {
		const response = await $fetch("/api/backup/list", {
			method: "GET",
			query: { path: contentPath },
		});
		return response as BackupList;
	};

	const deleteBackup = async (contentPath: string, backupId: string): Promise<{ success: boolean }> => {
		const response = await $fetch("/api/backup/delete", {
			method: "DELETE",
			query: { path: contentPath, id: backupId },
		});
		return response as { success: boolean };
	};

	return {
		createBackup,
		restoreBackup,
		getBackupList,
		deleteBackup,
	};
}
