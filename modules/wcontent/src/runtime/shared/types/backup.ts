export interface ContentBackup {
	id: string;
	contentPath: string;
	content: string;
	metadata: Record<string, any>;
	createdAt: number;
	createdAtISO: string;
	size: number;
}

export interface BackupResult {
	success: boolean;
	backup?: ContentBackup;
	error?: string;
}

export interface RestoreResult {
	success: boolean;
	content?: string;
	error?: string;
}

export interface BackupList {
	backups: ContentBackup[];
	totalBackups: number;
	totalSize: number;
}
