import { createError, defineEventHandler, readBody } from "h3";
import type { CommentResult } from "../../../shared/types/comments";
import { getCommentManager } from "../../utils/services/comments";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { contentPath, authorId, authorName, content, parentId } = body;

	if (!contentPath || !authorId || !authorName || !content) {
		throw createError({
			statusCode: 400,
			statusMessage: "Content path, author ID, author name, and content are required",
		});
	}

	const commentManager = getCommentManager();
	const result = await commentManager.addComment(contentPath, authorId, authorName, content, parentId);

	return result as CommentResult;
});
