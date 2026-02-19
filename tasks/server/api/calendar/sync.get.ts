import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	// Mock calendar sync
	return {
		events: [
			{ title: "Team Standup", start: new Date().toISOString(), end: new Date(Date.now() + 1800000).toISOString() },
			{ title: "Sprint Planning", start: new Date(Date.now() + 86400000).toISOString(), end: new Date(Date.now() + 90000000).toISOString() },
		],
	}
})
