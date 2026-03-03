import { defineEventHandler, readBody, createError } from "h3"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { provider, repository, token } = body

	if (!provider || !repository || !token) {
		throw createError({
			statusCode: 400,
			message: "Missing required fields: provider, repository, token",
		})
	}

	// TODO: Validate token and fetch repo info from provider
	const mockRepo = {
		provider,
		repository,
		commits: [],
		pullRequests: [],
		linkedAt: new Date().toISOString(),
	}

	return mockRepo
})
