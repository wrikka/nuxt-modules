import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const taskIds = body.taskIds as string[]

	// Mock CSV export
	const headers = "id,title,status,priority,assignee,due_date\n"
	const rows = [
		"task-1,Update landing page,In Progress,High,user-1,2026-02-20",
		"task-2,Fix navigation bug,Done,Critical,user-2,2026-02-18",
		"task-3,API integration,Backlog,Medium,user-1,2026-02-25",
	].join("\n")

	return headers + rows
})
