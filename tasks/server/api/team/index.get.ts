import { defineEventHandler, getQuery } from "h3"
import type { TeamMember, ActivityLog } from "~/shared/types/features"

const mockTeamMembers: TeamMember[] = [
	{
		id: "user-1",
		name: "John Doe",
		email: "john@example.com",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
		role: "admin",
		status: "online",
		lastSeen: new Date().toISOString(),
	},
	{
		id: "user-2",
		name: "Jane Smith",
		email: "jane@example.com",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
		role: "member",
		status: "away",
		lastSeen: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
	},
	{
		id: "user-3",
		name: "Bob Wilson",
		email: "bob@example.com",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
		role: "member",
		status: "offline",
		lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
	},
]

export default defineEventHandler(async (event) => {
	const query = getQuery(event)

	if (query.type === "members") {
		return mockTeamMembers
	}

	if (query.type === "activity") {
		const mockActivity: ActivityLog[] = [
			{
				id: "1",
				type: "task_created",
				userId: "user-1",
				user: mockTeamMembers[0],
				taskId: "task-1",
				taskTitle: "New feature implementation",
				metadata: {},
				createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
			},
			{
				id: "2",
				type: "status_changed",
				userId: "user-2",
				user: mockTeamMembers[1],
				taskId: "task-2",
				taskTitle: "Fix navigation bug",
				metadata: { from: "In Progress", to: "Done" },
				createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
			},
		]
		return mockActivity
	}

	if (query.type === "online") {
		return mockTeamMembers.filter(m => m.status !== "offline").map(m => m.id)
	}

	return mockTeamMembers
})
