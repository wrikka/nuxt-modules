import { createError, defineEventHandler, getQuery } from "h3";
import type { SearchOptions, SearchResult } from "../../../shared/types/search";
import { getContentSearchIndex } from "../../utils/services/search";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const { q: queryText, tags, category, limit, offset } = query;

	if (!queryText) {
		throw createError({
			statusCode: 400,
			statusMessage: "Query is required",
		});
	}

	const searchIndex = getContentSearchIndex();
	const options: SearchOptions = {
		query: queryText as string,
		tags: tags ? (tags as string).split(",") : undefined,
		category: category as string,
		limit: limit ? Number(limit) : undefined,
		offset: offset ? Number(offset) : undefined,
	};

	const result = searchIndex.search(options);

	return result as SearchResult;
});
