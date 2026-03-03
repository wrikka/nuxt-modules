import type { DailyStats } from "#pomodoro/types"

// In-memory storage for stats (replace with database in production)
const statsStore: Map<string, DailyStats> = new Map()

export default defineEventHandler(async (event): Promise<DailyStats[]> => {
	const method = event.method

	if (method === "GET") {
		// Return all stats sorted by date
		const stats = Array.from(statsStore.values())
		return stats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	}

	if (method === "POST") {
		const body = await readBody(event)
		const { pomodoros, focusTime, date, tasks = [] } = body

		if (!date || typeof pomodoros !== "number" || typeof focusTime !== "number") {
			throw createError({
				statusCode: 400,
				statusMessage: "Missing required fields: date, pomodoros, focusTime",
			})
		}

		const existing = statsStore.get(date)

		if (existing) {
			existing.pomodoros += pomodoros
			existing.focusTime += focusTime
			existing.tasks = [...new Set([...existing.tasks, ...tasks])]
		} else {
			const newStats: DailyStats = {
				date,
				pomodoros,
				focusTime,
				tasks,
			}
			statsStore.set(date, newStats)
		}

		return Array.from(statsStore.values())
	}

	throw createError({
		statusCode: 405,
		statusMessage: "Method not allowed",
	})
})
