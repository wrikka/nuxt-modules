import { defineEventHandler, readBody } from "h3"
import type { Sprint } from "~/shared/types/features"

const mockSprints: Sprint[] = [
	{
		id: "sprint-1",
		name: "Sprint 1",
		goal: "Foundation",
		status: "active",
		startDate: new Date().toISOString(),
		endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
		taskIds: ["task-1", "task-2"],
		capacity: 40,
		velocity: 0,
		completedPoints: 0,
	},
]

export default defineEventHandler(async (event) => {
	const sprintId = event.context.params?.sprintId as string
	const method = event.node.req.method

	if (method === "PATCH") {
		const body = await readBody(event)
		const sprint = mockSprints.find(s => s.id === sprintId)
		if (sprint) {
			Object.assign(sprint, body)
			return sprint
		}
		return { error: "Sprint not found" }
	}

	if (method === "GET") {
		const sprint = mockSprints.find(s => s.id === sprintId)
		return sprint || { error: "Sprint not found" }
	}

	return { error: "Method not allowed" }
})
