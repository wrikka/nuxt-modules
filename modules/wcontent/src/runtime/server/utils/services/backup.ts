import type { BackupList, BackupResult, ContentBackup, RestoreResult } from "../../../shared/types/backup";

export class ContentBackupManager {
	private backups: Map<string, ContentBackup[]> = new Map();
	private maxBackupsPerPath = 10;

	async createBackup(
		contentPath: string,
		content: string,
		metadata: Record<string, any>,
	): Promise<BackupResult> {
		try {
			const pathBackups = this.backups.get(contentPath) || [];
			const backup: ContentBackup = {
				id: `${contentPath}-${Date.now()}`,
				contentPath,
				content,
				metadata,
				createdAt: Date.now(),
				createdAtISO: new Date().toISOString(),
				size: content.length,
			};

			pathBackups.push(backup);

			if (pathBackups.length > this.maxBackupsPerPath) {
				pathBackups.shift();
			}

			this.backups.set(contentPath, pathBackups);

			return {
				success: true,
				backup,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message || "Failed to create backup",
			};
		}
	}

	async restoreBackup(contentPath: string, backupId: string): Promise<RestoreResult> {
		try {
			const pathBackups = this.backups.get(contentPath) || [];
			const backup = pathBackups.find(b => b.id === backupId);

			if (!backup) {
				return {
					success: false,
					error: "Backup not found",
				};
			}

			return {
				success: true,
				content: backup.content,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message || "Failed to restore backup",
			};
		}
	}

	async getBackupList(contentPath: string): Promise<BackupList> {
		const backups = this.backups.get(contentPath) || [];
		const totalSize = backups.reduce((sum, b) => sum + b.size, 0);

		return {
			backups,
			totalBackups: backups.length,
			totalSize,
		};
	}

	async deleteBackup(contentPath: string, backupId: string): Promise<boolean> {
		const pathBackups = this.backups.get(contentPath) || [];
		const index = pathBackups.findIndex(b => b.id === backupId);

		if (index === -1) {
			return false;
		}

		pathBackups.splice(index, 1);
		this.backups.set(contentPath, pathBackups);
		return true;
	}

	async deleteAllBackups(contentPath: string): Promise<void> {
		this.backups.delete(contentPath);
	}

	async getBackup(contentPath: string, backupId: string): Promise<ContentBackup | null> {
		const pathBackups = this.backups.get(contentPath) || [];
		return pathBackups.find(b => b.id === backupId) || null;
	}
}

let instance: ContentBackupManager | null = null;

export function getContentBackupManager(): ContentBackupManager {
	if (!instance) {
		instance = new ContentBackupManager();
	}
	return instance;
}
