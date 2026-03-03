import { createError, defineEventHandler, readBody } from "h3";
import type { SearchIndexItem } from "../../../shared/types/search";
import { getContentSearchIndex } from "../../utils/services/search";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { item } = body;

	if (!item || !item.id || !item.title || !item.content) {
		throw createError({
			statusCode: 400,
			statusMessage: "Item with id, title, and content is required",
		});
	}

	const searchIndex = getContentSearchIndex();
	searchIndex.addItem(item as SearchIndexItem);

	return { success: true };
});
