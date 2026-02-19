import { createError, defineEventHandler, getQuery } from "h3";
import type { Bookmark } from "../../../shared/types/bookmark";
import { getBookmarkManager } from "../../utils/services/bookmark";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const userId = query.userId as string;

	if (!userId) {
		throw createError({
			statusCode: 400,
			statusMessage: "User ID is required",
		});
	}

	const bookmarkManager = getBookmarkManager();
	const bookmarks = await bookmarkManager.getUserBookmarks(userId);

	return bookmarks as Bookmark[];
});
