import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { taskId, commitSha, provider, repository } = body

	// TODO: Store link in database
	return { success: true, taskId, commitSha, provider, repository }
})
