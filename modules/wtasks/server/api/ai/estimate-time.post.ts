import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	// Mock AI time estimation based on task details
	const title = body.title as string
	const subtaskCount = body.subtaskCount as number

	// Simple estimation logic
	let estimate = 4 // base hours
	if (title.toLowerCase().includes("bug")) estimate = 2
	if (title.toLowerCase().includes("feature")) estimate = 8
	if (title.toLowerCase().includes("refactor")) estimate = 6

	// Add time for subtasks
	estimate += subtaskCount * 1.5

	// Add variance
	estimate = Math.round(estimate * 10) / 10

	return estimate
})
