import { z } from "zod"
import { type Task, type TaskComment, TaskCommentSchema } from "~/shared/types/task"
import { db } from "../../../db"

const CommentBodySchema = z.object({
	text: z.string().min(1, { message: "Comment text is required" }),
})

export default defineEventHandler(async (event) => {
	const taskId = getRouterParam(event, "id")

	const IdSchema = z.string().min(1, "Task ID is required")
	const idValidation = IdSchema.safeParse(taskId)

	if (!idValidation.success) {
		throw createError({
			statusCode: 400,
			statusMessage: idValidation.error.issues.map(i => i.message).join(", "),
		})
	}

	const result = await readValidatedBody(event, body => CommentBodySchema.safeParse(body))

	if (!result.success) {
		throw createError({
			statusCode: 400,
			statusMessage: result.error.issues.map(i => i.message).join(", "),
		})
	}

	const task = db.tasks.find((i: Task) => i.id === taskId)

	if (!task) {
		throw createError({
			statusCode: 404,
			statusMessage: "Task not found",
		})
	}

	const newComment: TaskComment = {
		id: `comment-${Date.now()}`,
		text: result.data.text,
		createdAt: new Date().toISOString(),
		user: { name: "Jane Doe", avatarUrl: "https://randomuser.me/api/portraits/women/79.jpg" }, // Placeholder
	}

	TaskCommentSchema.parse(newComment)

	task.comments.push(newComment)

	return newComment
})
