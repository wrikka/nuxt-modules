import { defineEventHandler, readBody, getQuery } from "h3"
import type { TaskTemplate } from "~/shared/types/features"

const mockTemplates: TaskTemplate[] = [
	{
		id: "template-1",
		name: "Bug Report",
		description: "Standard bug report template",
		template: {
			title: "[BUG] ",
			description: "## Description\n\n## Steps to reproduce\n\n## Expected behavior\n\n## Actual behavior",
			priority: "High",
			tags: ["bug"],
			subtasks: [
				{ title: "Identify root cause" },
				{ title: "Implement fix" },
				{ title: "Add tests" },
			],
		},
		createdAt: new Date().toISOString(),
	},
	{
		id: "template-2",
		name: "Feature Request",
		description: "New feature template",
		template: {
			title: "[FEAT] ",
			description: "## User Story\n\n## Acceptance Criteria\n\n## Technical Notes",
			priority: "Medium",
			tags: ["feature"],
			subtasks: [
				{ title: "Design" },
				{ title: "Implementation" },
				{ title: "Documentation" },
			],
		},
		createdAt: new Date().toISOString(),
	},
]

export default defineEventHandler(async (event) => {
	const method = event.node.req.method

	if (method === "GET") {
		return mockTemplates
	}

	if (method === "POST") {
		const body = await readBody(event)
		const newTemplate: TaskTemplate = {
			id: `template-${Date.now()}`,
			...body,
			createdAt: new Date().toISOString(),
		}
		mockTemplates.push(newTemplate)
		return newTemplate
	}

	return mockTemplates
})
