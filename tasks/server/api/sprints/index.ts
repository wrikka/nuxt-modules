import { defineEventHandler, readBody } from "h3"
import type { Sprint } from "~/shared/types/features"

const mockSprints: Sprint[] = [
	{
		id: "sprint-1",
		name: "Sprint 1 - Foundation",
		goal: "Set up project foundation and core features",
		status: "active",
		startDate: new Date().toISOString(),
		endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
		taskIds: ["task-1", "task-2", "task-3"],
		capacity: 40,
		velocity: 0,
		completedPoints: 0,
	},
	{
		id: "sprint-2",
		name: "Sprint 2 - Features",
		goal: "Implement main user-facing features",
		status: "planning",
		startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
		endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 29).toISOString(),
		taskIds: [],
		capacity: 40,
	},
]

export default defineEventHandler(async (event) => {
	const method = event.node.req.method

	if (method === "GET") {
		return mockSprints
	}

	if (method === "POST") {
		const body = await readBody(event)
		const newSprint: Sprint = {
			id: `sprint-${Date.now()}`,
			...body,
			velocity: 0,
			completedPoints: 0,
		}
		mockSprints.push(newSprint)
		return newSprint
	}

	return mockSprints
})
