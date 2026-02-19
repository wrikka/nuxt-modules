import type { BackupConfig } from "../shared/types/advanced"
import { generateId } from "../utils"

export const useWorkOSBackup = () => {
	const createBackup = async (
		config: Omit<BackupConfig, "id" | "createdAt">,
	): Promise<BackupConfig> => {
		return await $fetch("/api/workos/backups", {
			method: "POST",
			body: {
				...config,
				id: generateId(),
				createdAt: new Date().toISOString(),
			},
		})
	}

	const runBackup = async (backupId: string): Promise<{
		backupId: string
		status: string
	}> => {
		return await $fetch(`/api/workos/backups/${backupId}/run`, {
			method: "POST",
		})
	}

	const restoreBackup = async (backupId: string): Promise<{
		restoreId: string
		status: string
	}> => {
		return await $fetch(`/api/workos/backups/${backupId}/restore`, {
			method: "POST",
		})
	}

	return {
		createBackup,
		runBackup,
		restoreBackup,
	}
}
