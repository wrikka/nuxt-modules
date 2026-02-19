import { defineEventHandler, getQuery } from "h3"
import type { Notification } from "~/shared/types/features"

// Mock data - in production this would come from database
const mockNotifications: Notification[] = [
	{
		id: "1",
		userId: "current-user",
		type: "assigned",
		title: "New task assigned",
		message: "You have been assigned to 'Update landing page'",
		taskId: "task-1",
		read: false,
		channels: ["in_app"],
		createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
	},
	{
		id: "2",
		userId: "current-user",
		type: "due_soon",
		title: "Task due soon",
		message: "'Fix navigation bug' is due in 2 hours",
		taskId: "task-2",
		read: false,
		channels: ["in_app", "email"],
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
	},
	{
		id: "3",
		userId: "current-user",
		type: "comment",
		title: "New comment",
		message: "John commented on 'API integration'",
		taskId: "task-3",
		read: true,
		channels: ["in_app"],
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
	},
]

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const userId = query.userId as string || "current-user"

	// Filter notifications for current user
	const userNotifications = mockNotifications.filter(n => n.userId === userId)

	return userNotifications.sort((a, b) =>
		new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	)
})
