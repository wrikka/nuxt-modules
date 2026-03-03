import type { SearchIndexItem, SearchOptions, SearchResult } from "../../shared/types/search";

export function useSearch() {
	const indexItem = async (item: SearchIndexItem): Promise<{ success: boolean }> => {
		const response = await $fetch("/api/search/index", {
			method: "POST",
			body: { item },
		});
		return response as { success: boolean };
	};

	const search = async (options: SearchOptions): Promise<SearchResult> => {
		const params: Record<string, any> = {
			q: options.query,
		};

		if (options.tags) {
			params.tags = options.tags.join(",");
		}
		if (options.category) {
			params.category = options.category;
		}
		if (options.limit) {
			params.limit = options.limit;
		}
		if (options.offset) {
			params.offset = options.offset;
		}

		const response = await $fetch("/api/search/search", {
			method: "GET",
			query: params,
		});
		return response as SearchResult;
	};

	return {
		indexItem,
		search,
	};
}
