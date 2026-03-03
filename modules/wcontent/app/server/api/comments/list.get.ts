import { createError, defineEventHandler, getQuery } from "h3";
import type { Comment } from "../../../shared/types/comments";
import { getCommentManager } from "../../utils/services/comments";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const contentPath = query.path as string;

	if (!contentPath) {
		throw createError({
			statusCode: 400,
			statusMessage: "Content path is required",
		});
	}

	const commentManager = getCommentManager();
	const comments = commentManager.getComments(contentPath);

	return comments as Comment[];
});
