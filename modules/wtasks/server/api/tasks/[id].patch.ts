import { type Task, TaskSchema } from "~/shared/types/task"
import { db } from "../../db"

const UpdateTaskBodySchema = TaskSchema.partial()

export default defineEventHandler(async (event) => {
	const taskId = getRouterParam(event, "id")

	if (!taskId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Task ID is required",
		})
	}

	const result = await readValidatedBody(event, body => UpdateTaskBodySchema.safeParse(body))

	if (!result.success) {
		throw createError({
			statusCode: 400,
			statusMessage: result.error.issues.map(i => i.message).join(", "),
		})
	}

	const taskIndex = db.tasks.findIndex(i => i.id === taskId)

	if (taskIndex === -1) {
		throw createError({
			statusCode: 404,
			statusMessage: "Task not found",
		})
	}

	const originalTask = db.tasks[taskIndex]

	if (!originalTask) {
		throw createError({
			statusCode: 404,
			statusMessage: "Task not found",
		})
	}

	const updatedTask: Task = {
		...originalTask,
		...result.data,
		updatedAt: new Date().toISOString(),
	}

	// Ensure the final object is still a valid Task
	TaskSchema.parse(updatedTask)

	db.tasks[taskIndex] = updatedTask

	return updatedTask
})
