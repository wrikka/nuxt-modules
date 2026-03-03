import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	// Mock leaderboard data
	return [
		{ userId: "user-1", name: "John Doe", points: 2500, level: 8 },
		{ userId: "user-2", name: "Jane Smith", points: 1800, level: 6 },
		{ userId: "current-user", name: "You", points: 1250, level: 5 },
		{ userId: "user-3", name: "Bob Wilson", points: 900, level: 4 },
	]
})
