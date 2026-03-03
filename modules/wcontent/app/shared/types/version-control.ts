export interface ContentVersion {
	id: string;
	contentPath: string;
	version: number;
	content: string;
	metadata: Record<string, any>;
	authorId: string;
	authorName: string;
	createdAt: number;
	createdAtISO: string;
	changeDescription?: string;
	isCurrent: boolean;
}

export interface VersionHistory {
	versions: ContentVersion[];
	totalVersions: number;
	currentVersion: number;
}

export interface VersionDiff {
	versionId: string;
	changes: {
		added: string[];
		removed: string[];
		modified: string[];
	};
}

export interface RollbackResult {
	success: boolean;
	version?: ContentVersion;
	error?: string;
}
