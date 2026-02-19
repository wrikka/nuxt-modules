import { defineEventHandler, readBody } from "h3"
import type { Project } from "~/shared/types/features"

const mockProjects: Project[] = [
	{
		id: "project-1",
		name: "Website Redesign",
		description: "Complete overhaul of company website",
		status: "active",
		taskIds: ["task-1", "task-2", "task-3"],
		memberIds: ["user-1", "user-2"],
		startDate: new Date().toISOString(),
		color: "#3b82f6",
	},
	{
		id: "project-2",
		name: "Mobile App",
		description: "Native mobile application",
		status: "planning",
		taskIds: ["task-4"],
		memberIds: ["user-1", "user-3"],
		startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
		color: "#8b5cf6",
	},
]

export default defineEventHandler(async (event) => {
	const method = event.node.req.method

	if (method === "GET") {
		return mockProjects
	}

	if (method === "POST") {
		const body = await readBody(event)
		const newProject: Project = {
			id: `project-${Date.now()}`,
			...body,
		}
		mockProjects.push(newProject)
		return newProject
	}

	return mockProjects
})
