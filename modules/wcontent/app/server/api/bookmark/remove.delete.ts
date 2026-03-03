import { createError, defineEventHandler, getQuery } from "h3";
import { getBookmarkManager } from "../../utils/services/bookmark";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const { userId, contentPath } = query;

	if (!userId || !contentPath) {
		throw createError({
			statusCode: 400,
			statusMessage: "User ID and content path are required",
		});
	}

	const bookmarkManager = getBookmarkManager();
	const success = await bookmarkManager.removeBookmark(userId as string, contentPath as string);

	return { success };
});
