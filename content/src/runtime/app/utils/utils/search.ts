import { ContentItem } from "../../../shared/types";

export interface SearchIndex {
	id: string;
	title?: string;
	content: string;
	tags?: string[];
	category?: string;
	_path: string;
}

export interface SearchResult {
	item: ContentItem;
	score: number;
	highlights: string[];
}

export class FullTextSearch {
	private index: Map<string, SearchIndex> = new Map();
	private trigrams: Map<string, Set<string>> = new Map();

	buildIndex(items: ContentItem[]) {
		this.index.clear();
		this.trigrams.clear();

		for (const item of items) {
			const searchIndex: SearchIndex = {
				id: item.__path,
				title: item.title,
				content: this.extractContent(item),
				tags: item.tags,
				category: item.category,
				_path: item.__path,
			};

			this.index.set(item.__path, searchIndex);
			this.indexTrigrams(searchIndex);
		}
	}

	private extractContent(item: ContentItem): string {
		const parts: string[] = [];

		if (item.title) parts.push(item.title);
		if (item.description) parts.push(item.description);
		if (item.body?.content) parts.push(item.body.content);
		if (item.excerpt) parts.push(JSON.stringify(item.excerpt));

		return parts.join(" ").toLowerCase();
	}

	private indexTrigrams(searchIndex: SearchIndex) {
		const content = searchIndex.content;
		const trigrams = this.generateTrigrams(content);

		for (const trigram of trigrams) {
			if (!this.trigrams.has(trigram)) {
				this.trigrams.set(trigram, new Set());
			}
			this.trigrams.get(trigram)!.add(searchIndex.id);
		}
	}

	private generateTrigrams(text: string): string[] {
		const trigrams: string[] = [];
		const words = text.split(/\s+/).filter(w => w.length > 2);

		for (const word of words) {
			if (word.length >= 3) {
				for (let i = 0; i <= word.length - 3; i++) {
					trigrams.push(word.slice(i, i + 3));
				}
			} else {
				trigrams.push(word);
			}
		}

		return trigrams;
	}

	search(query: string, limit: number = 10): SearchResult[] {
		if (!query.trim()) return [];

		const queryTrigrams = this.generateTrigrams(query.toLowerCase());
		const scores = new Map<string, number>();

		for (const trigram of queryTrigrams) {
			const matches = this.trigrams.get(trigram);
			if (matches) {
				for (const id of matches) {
					scores.set(id, (scores.get(id) || 0) + 1);
				}
			}
		}

		const results: SearchResult[] = [];

		for (const [id, score] of scores.entries()) {
			const item = this.index.get(id);
			if (item && score > 0) {
				results.push({
					item: this.indexToItem(item),
					score: score / queryTrigrams.length,
					highlights: this.generateHighlights(item.content, query),
				});
			}
		}

		return results
			.sort((a, b) => b.score - a.score)
			.slice(0, limit);
	}

	private indexToItem(index: SearchIndex): ContentItem {
		return {
			_path: index._path,
			__path: index._path,
			_dir: index._path.split("/").slice(-2, -1)[0] || "",
			_partial: false,
			title: index.title,
			tags: index.tags,
			category: index.category,
		};
	}

	private generateHighlights(content: string, query: string): string[] {
		const highlights: string[] = [];
		const queryWords = query.toLowerCase().split(/\s+/);

		for (const word of queryWords) {
			const regex = new RegExp(`.{0,20}${word}.{0,20}`, "gi");
			const matches = content.match(regex);

			if (matches) {
				highlights.push(...matches.slice(0, 3));
			}
		}

		return highlights;
	}
}

let searchInstance: FullTextSearch | null = null;

export function getSearchInstance(): FullTextSearch {
	if (!searchInstance) {
		searchInstance = new FullTextSearch();
	}
	return searchInstance;
}
