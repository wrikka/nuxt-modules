import { defineEventHandler, getQuery, createError } from "h3";

// Stub searchIndex - @wdocs/content not available
const searchIndex = {
	search: (query: string) => [] as Array<{ fields: Record<string, unknown> }>,
};

export default defineEventHandler(async (event) => {
	const query = getQuery(event)?.q?.toString();

	if (!query) {
		return [];
	}

	if (!searchIndex) {
		throw createError({
			statusCode: 503,
			statusMessage: "Search index is not available.",
		});
	}

	const results = searchIndex.search(query);

	// The Rust search returns a map, we need to format it for the client
	return results.map((doc: any) => doc.fields);
});
