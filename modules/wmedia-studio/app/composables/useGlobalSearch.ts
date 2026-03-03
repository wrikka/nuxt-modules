import { computed, ref } from "vue";

interface GlobalSearchResult {
	id: string;
	type: "project" | "asset" | "template" | "brand_kit" | "user";
	title: string;
	description: string;
	thumbnail?: string;
	url: string;
	relevance: number;
	metadata?: Record<string, unknown>;
}

interface GlobalSearchFilter {
	type?: GlobalSearchResult["type"][];
	dateFrom?: Date;
	dateTo?: Date;
	tags?: string[];
	createdBy?: string;
}

export function useGlobalSearch() {
	const query = ref("");
	const results = ref<GlobalSearchResult[]>([]);
	const isSearching = ref(false);
	const filters = ref<GlobalSearchFilter>({});
	const searchHistory = ref<string[]>([]);
	const recentSearches = computed(() => searchHistory.value.slice(0, 5));

	const search = async (q: string, filter?: GlobalSearchFilter) => {
		query.value = q;
		isSearching.value = true;

		if (filter) {
			filters.value = filter;
		}

		try {
			const params: Record<string, string> = { query: q };
			if (filter?.type) params.type = filter.type.join(",");
			if (filter?.dateFrom) params.dateFrom = filter.dateFrom.toISOString();
			if (filter?.dateTo) params.dateTo = filter.dateTo.toISOString();
			if (filter?.tags) params.tags = filter.tags.join(",");
			if (filter?.createdBy) params.createdBy = filter.createdBy;

			const data = await $fetch<{ results: GlobalSearchResult[] }>("/api/search", { params });
			results.value = data.results || [];

			if (q && !searchHistory.value.includes(q)) {
				searchHistory.value.unshift(q);
				if (searchHistory.value.length > 20) {
					searchHistory.value.pop();
				}
			}

			return results.value;
		} catch (error) {
			console.error("Search failed:", error);
			results.value = [];
			return [];
		} finally {
			isSearching.value = false;
		}
	};

	const clearSearch = () => {
		query.value = "";
		results.value = [];
		filters.value = {};
	};

	const updateFilter = (key: keyof GlobalSearchFilter, value: any) => {
		filters.value = { ...filters.value, [key]: value };
		if (query.value) {
			void search(query.value, filters.value);
		}
	};

	const removeFilter = (key: keyof GlobalSearchFilter) => {
		const newFilters = { ...filters.value };
		delete newFilters[key];
		filters.value = newFilters;
		if (query.value) {
			void search(query.value, filters.value);
		}
	};

	const clearFilters = () => {
		filters.value = {};
		if (query.value) {
			void search(query.value);
		}
	};

	const getResultsByType = (type: GlobalSearchResult["type"]) => {
		return results.value.filter(r => r.type === type);
	};

	const getTopResults = (limit: number = 10) => {
		return [...results.value]
			.sort((a, b) => b.relevance - a.relevance)
			.slice(0, limit);
	};

	const getRecentSearches = () => {
		return recentSearches.value;
	};

	const clearSearchHistory = () => {
		searchHistory.value = [];
	};

	const removeSearchFromHistory = (q: string) => {
		searchHistory.value = searchHistory.value.filter(h => h !== q);
	};

	const getSuggestions = async (q: string) => {
		try {
			const data = await $fetch<{ suggestions: string[] }>("/api/search/suggestions", {
				params: { query: q },
			});
			return data.suggestions || [];
		} catch (error) {
			console.error("Failed to get suggestions:", error);
			return [];
		}
	};

	return {
		query,
		results,
		isSearching,
		filters,
		searchHistory,
		recentSearches,
		search,
		clearSearch,
		updateFilter,
		removeFilter,
		clearFilters,
		getResultsByType,
		getTopResults,
		getRecentSearches,
		clearSearchHistory,
		removeSearchFromHistory,
		getSuggestions,
	};
}
