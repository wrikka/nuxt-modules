import { ref, computed } from "vue";
import type { SlideDeck } from "#wslide/types";

export interface SlideVersion {
	id: string;
	deck: SlideDeck;
	author: string;
	message: string;
	createdAt: Date;
	tags?: string[];
}

export interface VersionDiff {
	added: number;
	modified: number;
	deleted: number;
}

const STORAGE_KEY = "wslide:versions";

export function useVersionHistory() {
	const versions = ref<SlideVersion[]>([]);
	const currentVersion = ref<SlideVersion | null>(null);
	const isLoading = ref(false);

	const sortedVersions = computed(() => 
		[...versions.value].sort((a, b) => 
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)
	);

	const latestVersion = computed(() => sortedVersions.value[0] || null);

	function loadVersions(): void {
		isLoading.value = true;
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				versions.value = parsed.map((v: SlideVersion) => ({
					...v,
					createdAt: new Date(v.createdAt),
				}));
			}
		} finally {
			isLoading.value = false;
		}
	}

	function saveVersion(deck: SlideDeck, message: string, author = "Anonymous", tags?: string[]): SlideVersion {
		const version: SlideVersion = {
			id: `v-${Date.now()}`,
			deck: JSON.parse(JSON.stringify(deck)),
			author,
			message,
			createdAt: new Date(),
			tags,
		};
		
		versions.value.push(version);
		currentVersion.value = version;
		
		// Limit to 50 versions
		if (versions.value.length > 50) {
			versions.value.shift();
		}
		
		persistVersions();
		return version;
	}

	function persistVersions(): void {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(versions.value));
	}

	function restoreVersion(versionId: string): SlideDeck | null {
		const version = versions.value.find(v => v.id === versionId);
		if (version) {
			currentVersion.value = version;
			return JSON.parse(JSON.stringify(version.deck));
		}
		return null;
	}

	function compareVersions(fromId: string, toId: string): VersionDiff | null {
		const from = versions.value.find(v => v.id === fromId);
		const to = versions.value.find(v => v.id === toId);
		
		if (!from || !to) return null;
		
		const fromSlides = from.deck.slides || [];
		const toSlides = to.deck.slides || [];
		
		let added = 0;
		let modified = 0;
		let deleted = 0;
		
		// Simple comparison by content hash
		const fromContent = new Set(fromSlides.map(s => s.content));
		const toContent = new Set(toSlides.map(s => s.content));
		
		for (const content of toContent) {
			if (!fromContent.has(content)) added++;
		}
		
		for (const content of fromContent) {
			if (!toContent.has(content)) deleted++;
		}
		
		modified = Math.abs(fromSlides.length - toSlides.length) - added - deleted;
		modified = Math.max(0, modified);
		
		return { added, modified, deleted };
	}

	function deleteVersion(versionId: string): boolean {
		const index = versions.value.findIndex(v => v.id === versionId);
		if (index > -1) {
			versions.value.splice(index, 1);
			persistVersions();
			return true;
		}
		return false;
	}

	function searchVersions(query: string): SlideVersion[] {
		const lowerQuery = query.toLowerCase();
		return versions.value.filter(v => 
			v.message.toLowerCase().includes(lowerQuery) ||
			v.author.toLowerCase().includes(lowerQuery) ||
			v.tags?.some(t => t.toLowerCase().includes(lowerQuery))
		);
	}

	function exportHistory(): string {
		return JSON.stringify(versions.value, null, 2);
	}

	function importHistory(json: string): boolean {
		try {
			const parsed = JSON.parse(json);
			versions.value = parsed.map((v: SlideVersion) => ({
				...v,
				createdAt: new Date(v.createdAt),
			}));
			persistVersions();
			return true;
		} catch {
			return false;
		}
	}

	return {
		versions: readonly(versions),
		currentVersion: readonly(currentVersion),
		isLoading: readonly(isLoading),
		sortedVersions,
		latestVersion,
		loadVersions,
		saveVersion,
		restoreVersion,
		compareVersions,
		deleteVersion,
		searchVersions,
		exportHistory,
		importHistory,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
