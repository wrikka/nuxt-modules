import { createHash } from "crypto";
import type { ContentItem } from "../../../shared/types";

export interface ContentVersion {
	id: string;
	_path: string;
	version: number;
	content: ContentItem;
	hash: string;
	timestamp: string;
	author?: string;
	message?: string;
}

export interface VersionDiff {
	added: string[];
	removed: string[];
	modified: string[];
}

export class ContentVersioning {
	private versions: Map<string, ContentVersion[]> = new Map();

	saveVersion(item: ContentItem, author?: string, message?: string): ContentVersion {
		const _path = item.__path;
		const versions = this.versions.get(_path) || [];
		const nextVersion = versions.length + 1;

		const hash = this.generateHash(item);

		const version: ContentVersion = {
			id: `${_path}_v${nextVersion}`,
			_path,
			version: nextVersion,
			content: JSON.parse(JSON.stringify(item)),
			hash,
			timestamp: new Date().toISOString(),
			author,
			message,
		};

		versions.push(version);
		this.versions.set(_path, versions);

		return version;
	}

	getVersions(_path: string): ContentVersion[] {
		return this.versions.get(_path) || [];
	}

	getVersion(_path: string, version: number): ContentVersion | null {
		const versions = this.versions.get(_path);
		if (!versions) return null;

		return versions.find(v => v.version === version) || null;
	}

	getLatestVersion(_path: string): ContentVersion | null {
		const versions = this.versions.get(_path);
		if (!versions || versions.length === 0) return null;

		return versions[versions.length - 1];
	}

	compareVersions(_path: string, fromVersion: number, toVersion: number): VersionDiff | null {
		const from = this.getVersion(_path, fromVersion);
		const to = this.getVersion(_path, toVersion);

		if (!from || !to) return null;

		return this.generateDiff(from.content, to.content);
	}

	rollback(_path: string, versionNumber: number): ContentItem | null {
		const version = this.getVersion(_path, versionNumber);
		if (!version) return null;

		return JSON.parse(JSON.stringify(version.content));
	}

	private generateHash(item: ContentItem): string {
		const content = JSON.stringify(item);
		return createHash("sha256").update(content).digest("hex");
	}

	private generateDiff(from: ContentItem, to: ContentItem): VersionDiff {
		const diff: VersionDiff = {
			added: [],
			removed: [],
			modified: [],
		};

		// Compare all fields
		const fromKeys = Object.keys(from);
		const toKeys = Object.keys(to);

		// Find added keys
		for (const key of toKeys) {
			if (!fromKeys.includes(key)) {
				diff.added.push(key);
			}
		}

		// Find removed keys
		for (const key of fromKeys) {
			if (!toKeys.includes(key)) {
				diff.removed.push(key);
			}
		}

		// Find modified keys
		for (const key of fromKeys) {
			if (toKeys.includes(key)) {
				const fromValue = JSON.stringify(from[key as keyof ContentItem]);
				const toValue = JSON.stringify(to[key as keyof ContentItem]);

				if (fromValue !== toValue) {
					diff.modified.push(key);
				}
			}
		}

		return diff;
	}

	getHistory(_path: string, limit: number = 10): ContentVersion[] {
		const versions = this.versions.get(_path);
		if (!versions) return [];

		return versions.slice(-limit).reverse();
	}

	getStats(_path: string) {
		const versions = this.versions.get(_path);
		if (!versions) {
			return {
				total: 0,
				authors: [],
				latest: null,
			};
		}

		const authors = new Set(versions.map(v => v.author).filter(Boolean) as string[]);

		return {
			total: versions.length,
			authors: Array.from(authors),
			latest: versions[versions.length - 1],
		};
	}
}

let versioningInstance: ContentVersioning | null = null;

export function getContentVersioning(): ContentVersioning {
	if (!versioningInstance) {
		versioningInstance = new ContentVersioning();
	}
	return versioningInstance;
}
