import { desc, eq } from "drizzle-orm";
import { commentReplies, comments } from "../../db/schema";
import { useDb } from "../../utils/db";

export default defineEventHandler(async (event) => {
	const method = event.method;
	const db = useDb();

	if (method === "GET") {
		const query = getQuery(event);
		const projectId = query.projectId as string | undefined;

		let allComments = await db.query.comments.findMany({
			orderBy: desc(comments.createdAt),
		});

		if (projectId) {
			allComments = allComments.filter((c) => c.projectId === projectId);
		}

		// Fetch replies for each comment
		const commentsWithReplies = await Promise.all(
			allComments.map(async (comment) => {
				const replies = await db.query.commentReplies.findMany({
					where: eq(commentReplies.commentId, comment.id),
					orderBy: desc(commentReplies.createdAt),
				});

				return {
					...comment,
					resolved: Boolean(comment.resolved),
					replies,
				};
			}),
		);

		return { success: true, data: commentsWithReplies };
	}

	if (method === "POST") {
		const body = await readBody(event);
		const now = new Date();

		const comment = {
			id: crypto.randomUUID(),
			projectId: body.projectId,
			elementId: body.elementId,
			userId: body.userId,
			userName: body.userName,
			userAvatar: body.userAvatar,
			content: body.content,
			x: body.x || 0,
			y: body.y || 0,
			resolved: false,
			createdAt: now,
			updatedAt: now,
		};

		await db.insert(comments).values(comment);

		return {
			success: true,
			data: {
				...comment,
				resolved: false,
				replies: [],
			},
		};
	}

	throw createError({
		statusCode: 405,
		statusMessage: "Method Not Allowed",
	});
});
