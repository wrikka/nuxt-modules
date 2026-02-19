import { createError, defineEventHandler, getQuery } from "h3"
import { useWorkOSAuth } from "../../../composables/useWorkOSAuth"
import { createErrorHandler } from "../../../utils/errors"

export default defineEventHandler(async (event) => {
	try {
		const { getAuthorizationUrl } = useWorkOSAuth()
		const query = getQuery(event)

		const authUrl = getAuthorizationUrl({
			redirectUri: query.redirectUri as string || "/auth/callback",
			provider: query.provider as string,
		})

		return { url: authUrl }
	} catch (error) {
		const handledError = createErrorHandler(error)
		throw createError({
			statusCode: 400,
			statusMessage: handledError.message,
		})
	}
})
