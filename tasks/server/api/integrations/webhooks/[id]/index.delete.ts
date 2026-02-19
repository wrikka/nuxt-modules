import { defineEventHandler, getRouterParam } from "h3"

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id")

	// TODO: Delete from database
	return { success: true, id }
})
