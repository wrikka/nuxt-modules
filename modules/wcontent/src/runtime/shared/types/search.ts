export interface SearchIndexItem {
	id: string;
	path: string;
	title: string;
	content: string;
	tags: string[];
	category: string;
	author: string;
	createdAt: number;
	updatedAt: number;
}

export interface SearchResult {
	items: SearchIndexItem[];
	total: number;
	query: string;
}

export interface SearchOptions {
	query: string;
	tags?: string[];
	category?: string;
	limit?: number;
	offset?: number;
}
