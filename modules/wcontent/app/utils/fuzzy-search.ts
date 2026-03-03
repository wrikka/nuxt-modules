// Stub for fuzzy search
export function getFuzzySearch() {
	return {
		searchWithTypoTolerance: (_items: any[], _query: string, _options: any) => [],
		suggestCorrections: (_query: string, _items: any[], _limit: number) => [],
	};
}
