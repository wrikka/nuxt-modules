import { defineEventHandler, getRouterParam } from "h3"

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id")

	// TODO: Send test payload to webhook
	return {
		success: true,
		message: `Test webhook sent to ${id}`,
	}
})
