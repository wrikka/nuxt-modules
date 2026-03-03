import type { LibraryAsset as Asset } from "./useAssetLibrary";

interface AssetSearchFilters {
	type?: Asset["type"][];
	folderId?: string;
	tags?: string[];
	dateFrom?: Date;
	dateTo?: Date;
	sizeMin?: number;
	sizeMax?: number;
	widthMin?: number;
	widthMax?: number;
	heightMin?: number;
	heightMax?: number;
}

export function useAssetSearch(assets: Ref<Asset[]>) {
	const query = ref("");
	const filters = ref<AssetSearchFilters>({});
	const searchHistory = ref<string[]>([]);
	const isSearching = ref(false);

	const filteredAssets = computed(() => {
		let results = assets.value;

		if (query.value) {
			results = results.filter(asset => matchesQuery(asset, query.value));
		}

		if (Object.keys(filters.value).length > 0) {
			results = results.filter(asset => matchesFilters(asset, filters.value));
		}

		return results;
	});

	const matchesQuery = (asset: Asset, q: string): boolean => {
		if (!q) return true;

		const lowerQuery = q.toLowerCase();

		return (
			asset.name.toLowerCase().includes(lowerQuery)
			|| asset.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
		);
	};

	const matchesFilters = (asset: Asset, f: AssetSearchFilters): boolean => {
		if (f.type && f.type.length > 0 && !f.type.includes(asset.type)) {
			return false;
		}

		if (f.folderId && asset.folderId !== f.folderId) {
			return false;
		}

		if (f.tags && f.tags.length > 0) {
			const hasAllTags = f.tags.every((tag: string) => asset.tags.includes(tag));
			if (!hasAllTags) return false;
		}

		if (f.dateFrom && new Date(asset.createdAt) < f.dateFrom) {
			return false;
		}

		if (f.dateTo && new Date(asset.createdAt) > f.dateTo) {
			return false;
		}

		if (f.sizeMin && asset.size < f.sizeMin) {
			return false;
		}

		if (f.sizeMax && asset.size > f.sizeMax) {
			return false;
		}

		if (f.widthMin && asset.width && asset.width < f.widthMin) {
			return false;
		}

		if (f.widthMax && asset.width && asset.width > f.widthMax) {
			return false;
		}

		if (f.heightMin && asset.height && asset.height < f.heightMin) {
			return false;
		}

		if (f.heightMax && asset.height && asset.height > f.heightMax) {
			return false;
		}

		return true;
	};

	const search = async (q: string, f?: AssetSearchFilters) => {
		isSearching.value = true;

		try {
			if (q && !searchHistory.value.includes(q)) {
				searchHistory.value.unshift(q);
				if (searchHistory.value.length > 10) {
					searchHistory.value.pop();
				}
			}

			query.value = q;
			if (f) {
				filters.value = f;
			}

			const results = filteredAssets.value.map(asset => ({
				asset,
				score: calculateScore(asset, q),
				highlights: getHighlights(asset, q),
			}));

			return results.sort((a, b) => b.score - a.score);
		} finally {
			isSearching.value = false;
		}
	};

	const calculateScore = (asset: Asset, q: string): number => {
		if (!q) return 0;

		const lowerQuery = q.toLowerCase();
		let score = 0;

		if (asset.name.toLowerCase().includes(lowerQuery)) {
			score += 10;
		}

		if (asset.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))) {
			score += 5;
		}

		return score;
	};

	const getHighlights = (asset: Asset, q: string): string[] => {
		if (!q) return [];

		const lowerQuery = q.toLowerCase();
		const highlights: string[] = [];

		if (asset.name.toLowerCase().includes(lowerQuery)) {
			highlights.push(asset.name);
		}

		asset.tags.forEach((tag: string) => {
			if (tag.toLowerCase().includes(lowerQuery)) {
				highlights.push(tag);
			}
		});

		return highlights;
	};

	const hasFilters = computed(() => Object.keys(filters.value).length > 0);

	const clearSearch = () => {
		query.value = "";
	};

	const setFilter = (key: keyof AssetSearchFilters, value: any) => {
		filters.value = { ...filters.value, [key]: value };
	};

	const removeFilter = (key: keyof AssetSearchFilters) => {
		const newFilters = { ...filters.value };
		delete newFilters[key];
		filters.value = newFilters;
	};

	const clearFilters = () => {
		filters.value = {};
	};

	const getSearchResults = () => {
		return filteredAssets.value.map(asset => ({
			asset,
			score: calculateScore(asset, query.value),
			highlights: getHighlights(asset, query.value),
		}));
	};

	const getRecentSearches = () => {
		return searchHistory.value.slice(0, 5);
	};

	const clearSearchHistory = () => {
		searchHistory.value = [];
	};

	const removeSearchFromHistory = (q: string) => {
		searchHistory.value = searchHistory.value.filter(h => h !== q);
	};

	return {
		query,
		filters,
		searchHistory,
		isSearching,
		filteredAssets,
		hasFilters,
		search,
		clearSearch,
		setFilter,
		removeFilter,
		clearFilters,
		getSearchResults,
		getRecentSearches,
		clearSearchHistory,
		removeSearchFromHistory,
	};
}
