import type { ContentItem } from "../../../shared/types";

export interface FuzzySearchOptions {
	maxDistance?: number;
	caseSensitive?: boolean;
	_includeScore?: boolean;
	threshold?: number;
}

export interface FuzzySearchResult {
	item: ContentItem;
	score: number;
	distance: number;
}

export class FuzzySearch {
	// Levenshtein distance algorithm
	private levenshteinDistance(str1: string, str2: string): number {
		const m = str1.length;
		const n = str2.length;
		const dp: number[][] = [];

		for (let i = 0; i <= m; i++) {
			dp[i] = [i];
		}

		for (let j = 0; j <= n; j++) {
			dp[0][j] = j;
		}

		for (let i = 1; i <= m; i++) {
			for (let j = 1; j <= n; j++) {
				if (str1[i - 1] === str2[j - 1]) {
					dp[i][j] = dp[i - 1][j - 1];
				} else {
					dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]) + 1;
				}
			}
		}

		return dp[m][n];
	}

	// Calculate similarity score (0-1)
	private _calculateSimilarity(str1: string, str2: string): number {
		const distance = this.levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
		const maxLen = Math.max(str1.length, str2.length);
		return maxLen === 0 ? 1 : 1 - distance / maxLen;
	}

	// Check if strings are similar enough
	_isSimilar(str1: string, str2: string, threshold = 0.7): boolean {
		return this._calculateSimilarity(str1, str2) >= threshold;
	}

	// Phonetic matching (simple version)
	private phoneticMatch(str: string): string {
		return str
			.toLowerCase()
			.replace(/[aeiou]/g, "")
			.replace(/[bcdfghjklmnpqrstvwxyz]/g, (char) => {
				const map: Record<string, string> = {
					b: "1",
					p: "1",
					f: "1",
					v: "1",
					c: "2",
					k: "2",
					s: "2",
					g: "2",
					j: "2",
					d: "3",
					t: "3",
					l: "4",
					m: "5",
					n: "5",
					r: "6",
				};
				return map[char] || char;
			});
	}

	// Extract searchable content from item
	private extractSearchableContent(item: ContentItem): string {
		const parts: string[] = [];

		if (item.title) parts.push(item.title);
		if (item.description) parts.push(item.description);
		if (item.body?.content) parts.push(item.body.content);
		if (item.excerpt) parts.push(JSON.stringify(item.excerpt));
		if (item.tags) parts.push(item.tags.join(" "));

		return parts.join(" ").toLowerCase();
	}

	// Search with fuzzy matching
	search(
		items: ContentItem[],
		query: string,
		options: FuzzySearchOptions = {},
	): FuzzySearchResult[] {
		const {
			maxDistance = 3,
			caseSensitive = false,
			threshold = 0.7,
		} = options;

		if (!query.trim()) return [];

		const results: FuzzySearchResult[] = [];
		const searchQuery = caseSensitive ? query : query.toLowerCase();

		for (const item of items) {
			const content = this.extractSearchableContent(item);
			const words = content.split(/\s+/);

			let bestScore = 0;
			let bestDistance = Infinity;

			for (const word of words) {
				if (word.length < 2) continue;

				const distance = this.levenshteinDistance(word, searchQuery);
				const similarity = this._calculateSimilarity(word, searchQuery);

				if (distance <= maxDistance || similarity >= threshold) {
					if (similarity > bestScore) {
						bestScore = similarity;
						bestDistance = distance;
					}
				}
			}

			if (bestScore > 0) {
				results.push({
					item,
					score: bestScore,
					distance: bestDistance,
				});
			}
		}

		return results.sort((a, b) => b.score - a.score);
	}

	// Search with typo tolerance
	searchWithTypoTolerance(
		items: ContentItem[],
		query: string,
		options: FuzzySearchOptions = {},
	): FuzzySearchResult[] {
		const results = this.search(items, query, options);

		// Also try phonetic matching
		const phoneticQuery = this.phoneticMatch(query);

		for (const item of items) {
			const content = this.extractSearchableContent(item);
			const phoneticContent = this.phoneticMatch(content);

			if (phoneticContent.includes(phoneticQuery)) {
				const existingIndex = results.findIndex((r) => r.item.__path === item.__path);
				if (existingIndex === -1) {
					results.push({
						item,
						score: 0.5,
						distance: 3,
					});
				}
			}
		}

		return results.sort((a, b) => b.score - a.score);
	}

	// Suggest corrections
	suggestCorrections(query: string, items: ContentItem[], limit = 5): string[] {
		const suggestions = new Set<string>();

		for (const item of items) {
			const content = this.extractSearchableContent(item);
			const words = content.split(/\s+/);

			for (const word of words) {
				if (word.length < 3) continue;

				const distance = this.levenshteinDistance(word, query);
				if (distance <= 2 && distance > 0) {
					suggestions.add(word);
				}
			}
		}

		return Array.from(suggestions).slice(0, limit);
	}
}

let fuzzySearchInstance: FuzzySearch | null = null;

export function getFuzzySearch(): FuzzySearch {
	if (!fuzzySearchInstance) {
		fuzzySearchInstance = new FuzzySearch();
	}
	return fuzzySearchInstance;
}
