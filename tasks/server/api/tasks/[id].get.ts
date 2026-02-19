import type { Task } from "../../../shared/types/task"
import { db } from "../../db"

export default defineEventHandler((event) => {
	const taskId = getRouterParam(event, "id")

	if (!taskId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Task ID is required",
		})
	}

	const task = db.tasks.find((i: Task) => i.id === taskId)

	if (!task) {
		throw createError({
			statusCode: 404,
			statusMessage: "Task not found",
		})
	}

	return task
})
