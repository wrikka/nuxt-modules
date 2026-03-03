import { z } from "zod"
import type { Task } from "~/shared/types/task"
import { TaskSchema } from "~/shared/types/task"
import { db } from "../db"

const CreateTaskBodySchema = z.object({
	title: z.string().min(1, { message: "Title is required" }),
})

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, body => CreateTaskBodySchema.safeParse(body))

	if (!result.success) {
		throw createError({
			statusCode: 400,
			statusMessage: result.error.issues.map(i => i.message).join(", "),
		})
	}

	const now = new Date()
	const newTask: Task = {
		id: `XDM-${Math.floor(Math.random() * 1000)}`,
		title: result.data.title,
		status: "Backlog",
		priority: "None",
		tags: [],
		date: now.toISOString(),
		updatedAt: now.toISOString(),
		comments: [],
		subtasks: [],
	}

	// Validate the final object against the full TaskSchema before saving
	TaskSchema.parse(newTask)

	db.tasks.push(newTask)
	return newTask
})
