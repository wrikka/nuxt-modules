import Fuse from "fuse.js";
import type { SearchIndexItem, SearchOptions, SearchResult } from "../../../shared/types/search";

export class ContentSearchIndex {
	private index: Fuse<SearchIndexItem>;
	private items: Map<string, SearchIndexItem> = new Map();

	constructor() {
		this.index = new Fuse([], {
			keys: ["title", "content", "tags", "category", "author"],
			threshold: 0.3,
			includeScore: true,
		});
	}

	addItem(item: SearchIndexItem): void {
		this.items.set(item.id, item);
		this.rebuildIndex();
	}

	addItems(items: SearchIndexItem[]): void {
		for (const item of items) {
			this.items.set(item.id, item);
		}
		this.rebuildIndex();
	}

	updateItem(item: SearchIndexItem): void {
		this.items.set(item.id, item);
		this.rebuildIndex();
	}

	removeItem(id: string): void {
		this.items.delete(id);
		this.rebuildIndex();
	}

	search(options: SearchOptions): SearchResult {
		let results = Array.from(this.index.search(options.query));

		if (options.tags && options.tags.length > 0) {
			results = results.filter(result => {
				const item = result.item;
				return options.tags!.some(tag => item.tags.includes(tag));
			});
		}

		if (options.category) {
			results = results.filter(result => result.item.category === options.category);
		}

		const offset = options.offset || 0;
		const limit = options.limit || 20;

		return {
			items: results.slice(offset, offset + limit).map((r): SearchIndexItem => r.item),
			total: results.length,
			query: options.query,
		};
	}

	private rebuildIndex(): void {
		this.index = new Fuse(Array.from(this.items.values()), {
			keys: ["title", "content", "tags", "category", "author"],
			threshold: 0.3,
			includeScore: true,
		});
	}

	getAllItems(): SearchIndexItem[] {
		return Array.from(this.items.values());
	}

	getItem(id: string): SearchIndexItem | null {
		return this.items.get(id) || null;
	}
}

let instance: ContentSearchIndex | null = null;

export function getContentSearchIndex(): ContentSearchIndex {
	if (!instance) {
		instance = new ContentSearchIndex();
	}
	return instance;
}
