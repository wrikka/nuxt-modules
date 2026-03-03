import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { provider, repository } = body

	// TODO: Remove from database
	return { success: true, provider, repository }
})
