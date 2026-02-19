import type { ContentItem } from "../../../shared/types";

export interface VersionHistoryConfig {
	enableVersionHistory: boolean;
	maxVersions: number;
	enableVersionComparison: boolean;
}

export interface ContentVersion {
	id: string;
	contentId: string;
	version: number;
	author: string;
	changes: string;
	createdAt: string;
	content: ContentItem;
}

export class ContentVersionHistory {
	private config: VersionHistoryConfig;
	private versions: Map<string, ContentVersion[]> = new Map();

	constructor(config?: VersionHistoryConfig) {
		this.config = config || {
			enableVersionHistory: true,
			maxVersions: 50,
			enableVersionComparison: true,
		};
	}

	createVersion(content: ContentItem, author: string, changes: string): ContentVersion {
		if (!this.config.enableVersionHistory) {
			throw new Error("Version history is not enabled");
		}

		const contentId = content._path;
		const existingVersions = this.versions.get(contentId) || [];
		const nextVersion = existingVersions.length + 1;

		const version: ContentVersion = {
			id: crypto.randomUUID(),
			contentId,
			version: nextVersion,
			author,
			changes,
			createdAt: new Date().toISOString(),
			content: { ...content },
		};

		if (!this.versions.has(contentId)) {
			this.versions.set(contentId, []);
		}

		const versions = this.versions.get(contentId)!;
		versions.push(version);

		// Keep only the max number of versions
		if (versions.length > this.config.maxVersions) {
			versions.shift();
		}

		return version;
	}

	getVersions(contentId: string): ContentVersion[] {
		return this.versions.get(contentId) || [];
	}

	getVersion(contentId: string, versionNumber: number): ContentVersion | null {
		const versions = this.versions.get(contentId);
		if (!versions) return null;

		return versions.find((v) => v.version === versionNumber) || null;
	}

	getLatestVersion(contentId: string): ContentVersion | null {
		const versions = this.versions.get(contentId);
		if (!versions || versions.length === 0) return null;

		return versions[versions.length - 1];
	}

	compareVersions(
		contentId: string,
		version1: number,
		version2: number,
	): { added: string[]; removed: string[]; modified: string[] } | null {
		if (!this.config.enableVersionComparison) {
			return null;
		}

		const v1 = this.getVersion(contentId, version1);
		const v2 = this.getVersion(contentId, version2);

		if (!v1 || !v2) return null;

		const added: string[] = [];
		const removed: string[] = [];
		const modified: string[] = [];

		// Compare fields
		for (const key of Object.keys(v2.content)) {
			const val1 = v1.content[key];
			const val2 = v2.content[key];

			if (val1 === undefined && val2 !== undefined) {
				added.push(key);
			} else if (val1 !== undefined && val2 === undefined) {
				removed.push(key);
			} else if (val1 !== val2) {
				modified.push(key);
			}
		}

		return { added, removed, modified };
	}

	restoreVersion(contentId: string, versionNumber: number): ContentItem | null {
		const version = this.getVersion(contentId, versionNumber);
		if (!version) return null;

		return { ...version.content };
	}

	deleteVersion(contentId: string, versionNumber: number): boolean {
		const versions = this.versions.get(contentId);
		if (!versions) return false;

		const index = versions.findIndex((v) => v.version === versionNumber);
		if (index !== -1) {
			versions.splice(index, 1);
			return true;
		}

		return false;
	}

	clearHistory(contentId: string): void {
		this.versions.delete(contentId);
	}

	getAllVersions(): Map<string, ContentVersion[]> {
		return new Map(this.versions);
	}

	getConfig(): VersionHistoryConfig {
		return this.config;
	}
}

// Singleton instance
let versionHistoryInstance: ContentVersionHistory | null = null;

export function useContentVersionHistory(config?: VersionHistoryConfig): ContentVersionHistory {
	if (!versionHistoryInstance) {
		versionHistoryInstance = new ContentVersionHistory(config);
	}
	return versionHistoryInstance;
}

// Helper composable for version history
export function useVersionHistory(contentId: string) {
	const versionHistory = useContentVersionHistory();

	return {
		createVersion: (content: ContentItem, author: string, changes: string) =>
			versionHistory.createVersion(content, author, changes),
		getVersions: () => versionHistory.getVersions(contentId),
		getVersion: (versionNumber: number) => versionHistory.getVersion(contentId, versionNumber),
		getLatestVersion: () => versionHistory.getLatestVersion(contentId),
		compareVersions: (
			version1: number,
			version2: number,
		) => versionHistory.compareVersions(contentId, version1, version2),
		restoreVersion: (versionNumber: number) => versionHistory.restoreVersion(contentId, versionNumber),
		deleteVersion: (versionNumber: number) => versionHistory.deleteVersion(contentId, versionNumber),
		clearHistory: () => versionHistory.clearHistory(contentId),
	};
}
