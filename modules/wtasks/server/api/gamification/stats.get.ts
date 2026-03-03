import { defineEventHandler, getQuery } from "h3"
import type { UserGamification } from "~/shared/types/features"

const mockGamification: UserGamification = {
	userId: "current-user",
	points: 1250,
	level: 5,
	badges: [
		{ id: "badge-1", name: "First Task", description: "Completed your first task", icon: "mdi:star", earnedAt: new Date().toISOString() },
		{ id: "badge-2", name: "Speed Demon", description: "Completed 5 tasks in one day", icon: "mdi:lightning-bolt", earnedAt: new Date().toISOString() },
	],
	streak: { current: 7, longest: 14, lastActivity: new Date().toISOString() },
	stats: { tasks_completed: 24, time_tracked: 48, comments_posted: 12 },
}

export default defineEventHandler(async (event) => {
	return mockGamification
})
