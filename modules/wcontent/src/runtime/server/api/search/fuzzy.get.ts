import { createError, eventHandler, getQuery } from "h3";
import { getFuzzySearch } from "../../../utils/fuzzy-search";

export default eventHandler(async (event) => {
	const query = getQuery(event);
	const q = query.q as string;
	const threshold = Number(query.threshold) || 0.7;
	const maxDistance = Number(query.maxDistance) || 3;
	const limit = Number(query.limit) || 10;

	if (!q) {
		throw createError({
			statusCode: 400,
			message: "Missing search query",
		});
	}

	// Perform fuzzy search
	const fuzzySearch = getFuzzySearch();
	const results = fuzzySearch.searchWithTypoTolerance([], q, {
		threshold,
		maxDistance,
	});

	// Get suggestions
	const suggestions = fuzzySearch.suggestCorrections(q, [], 5);

	return {
		results: results.slice(0, limit).map((r: any) => ({
			item: r.item,
			score: r.score,
		})),
		suggestions,
		total: results.length,
	};
});
