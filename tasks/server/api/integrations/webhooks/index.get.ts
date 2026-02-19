import { defineEventHandler } from "h3"

export default defineEventHandler(async () => {
	// TODO: Fetch from database
	return [
		{
			id: "1",
			provider: "slack" as const,
			name: "Development Channel",
			url: "https://hooks.slack.com/services/...",
			events: ["task.created", "task.completed"],
			isActive: true,
			createdAt: new Date().toISOString(),
		},
	]
})
