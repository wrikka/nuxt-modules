import type { ContentVersion, RollbackResult, VersionHistory } from "../../../shared/types/version-control";

export class ContentVersionControl {
	private versions: Map<string, ContentVersion[]> = new Map();

	async createVersion(
		contentPath: string,
		content: string,
		metadata: Record<string, any>,
		authorId: string,
		authorName: string,
		changeDescription?: string,
	): Promise<ContentVersion> {
		const pathVersions = this.versions.get(contentPath) || [];
		const nextVersion = pathVersions.length + 1;

		const version: ContentVersion = {
			id: `${contentPath}-v${nextVersion}-${Date.now()}`,
			contentPath,
			version: nextVersion,
			content,
			metadata,
			authorId,
			authorName,
			createdAt: Date.now(),
			createdAtISO: new Date().toISOString(),
			changeDescription,
			isCurrent: true,
		};

		pathVersions.forEach(v => (v.isCurrent = false));
		pathVersions.push(version);
		this.versions.set(contentPath, pathVersions);

		return version;
	}

	async getVersionHistory(contentPath: string): Promise<VersionHistory> {
		const versions = this.versions.get(contentPath) || [];
		const currentVersion = versions.find(v => v.isCurrent)?.version || 0;

		return {
			versions,
			totalVersions: versions.length,
			currentVersion,
		};
	}

	async getVersion(contentPath: string, versionNumber: number): Promise<ContentVersion | null> {
		const versions = this.versions.get(contentPath) || [];
		return versions.find(v => v.version === versionNumber) || null;
	}

	async getCurrentVersion(contentPath: string): Promise<ContentVersion | null> {
		const versions = this.versions.get(contentPath) || [];
		return versions.find(v => v.isCurrent) || null;
	}

	async rollback(contentPath: string, versionNumber: number): Promise<RollbackResult> {
		const versions = this.versions.get(contentPath) || [];
		const targetVersion = versions.find(v => v.version === versionNumber);

		if (!targetVersion) {
			return {
				success: false,
				error: `Version ${versionNumber} not found`,
			};
		}

		versions.forEach(v => (v.isCurrent = false));
		targetVersion.isCurrent = true;
		this.versions.set(contentPath, versions);

		return {
			success: true,
			version: targetVersion,
		};
	}

	async deleteOldVersions(contentPath: string, keepLastN: number = 10): Promise<void> {
		const versions = this.versions.get(contentPath) || [];
		if (versions.length <= keepLastN) return;

		const toKeep = versions.slice(versions.length - keepLastN);
		this.versions.set(contentPath, toKeep);
	}

	async compareVersions(contentPath: string, version1: number, version2: number): Promise<{
		version1: ContentVersion | null;
		version2: ContentVersion | null;
	}> {
		const versions = this.versions.get(contentPath) || [];
		return {
			version1: versions.find(v => v.version === version1) || null,
			version2: versions.find(v => v.version === version2) || null,
		};
	}
}

let instance: ContentVersionControl | null = null;

export function getContentVersionControl(): ContentVersionControl {
	if (!instance) {
		instance = new ContentVersionControl();
	}
	return instance;
}
