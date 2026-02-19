import { defineEventHandler, readBody, getRouterParam } from "h3"

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id")
	const body = await readBody(event)

	// TODO: Update in database
	return {
		id,
		...body,
		updatedAt: new Date().toISOString(),
	}
})
