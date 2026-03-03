import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { taskId, frameId, fileId } = body

	// TODO: Store link in database
	return { success: true, taskId, frameId, fileId }
})
