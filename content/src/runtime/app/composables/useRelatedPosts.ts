import type { SearchIndexItem } from "../../shared/types/search";

export function useRelatedPosts() {
	const getRelatedPosts = async (
		currentTags: string[],
		currentCategory: string,
		currentPath: string,
		limit = 3,
	): Promise<SearchIndexItem[]> => {
		const response = await $fetch("/api/search/search", {
			method: "GET",
			query: {
				q: "",
				tags: currentTags.join(","),
				category: currentCategory,
				limit: limit * 2,
			},
		});

		const results = response as { items: SearchIndexItem[] };
		return results.items.filter(item => item.path !== currentPath).slice(0, limit);
	};

	return {
		getRelatedPosts,
	};
}
