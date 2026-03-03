import { createError, defineEventHandler, readBody } from "h3";
import type { Bookmark } from "../../../shared/types/bookmark";
import { getBookmarkManager } from "../../utils/services/bookmark";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { userId, contentPath, contentTitle } = body;

	if (!userId || !contentPath || !contentTitle) {
		throw createError({
			statusCode: 400,
			statusMessage: "User ID, content path, and content title are required",
		});
	}

	const bookmarkManager = getBookmarkManager();
	const bookmark = await bookmarkManager.addBookmark(userId, contentPath, contentTitle);

	return bookmark as Bookmark;
});
