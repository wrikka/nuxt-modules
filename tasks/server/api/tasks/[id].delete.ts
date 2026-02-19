import { z } from "zod"
import type { Task } from "~/shared/types/task"
import { db } from "../../db"

export default defineEventHandler(async (event) => {
	const taskId = getRouterParam(event, "id")

	const IdSchema = z.string().min(1, "Task ID is required")
	const validation = IdSchema.safeParse(taskId)

	if (!validation.success) {
		throw createError({
			statusCode: 400,
			statusMessage: validation.error.issues.map(i => i.message).join(", "),
		})
	}

	const taskIndex = db.tasks.findIndex((i: Task) => i.id === taskId)

	if (taskIndex === -1) {
		throw createError({
			statusCode: 404,
			statusMessage: "Task not found",
		})
	}

	db.tasks.splice(taskIndex, 1)

	return { success: true }
})
