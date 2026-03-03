import { defineEventHandler, getQuery } from "h3"
import type { Task } from "~/shared/types/task"

const mockTasks: Task[] = [
	{
		id: "task-1",
		title: "Update landing page",
		description: "Modernize the landing page design",
		status: "In Progress",
		priority: "High",
		assignee: { id: "user-1", name: "John Doe", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john" },
		tags: [{ id: "tag-1", name: "design", color: "#3b82f6" }],
		subtasks: [],
		dueDate: "2026-02-20",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: "task-2",
		title: "Fix navigation bug",
		description: "Menu doesn't work on mobile",
		status: "Done",
		priority: "Critical",
		assignee: { id: "user-2", name: "Jane Smith", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane" },
		tags: [{ id: "tag-2", name: "bug", color: "#ef4444" }],
		subtasks: [],
		dueDate: "2026-02-18",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
]

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const q = (query.q as string || "").toLowerCase()
	const includeArchived = query.archived === "true"

	if (!q) return mockTasks

	return mockTasks.filter(task =>
		task.title.toLowerCase().includes(q) ||
		task.description.toLowerCase().includes(q) ||
		task.tags.some(tag => tag.name.toLowerCase().includes(q))
	)
})
