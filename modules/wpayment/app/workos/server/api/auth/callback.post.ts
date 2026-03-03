import { createError, defineEventHandler, getQuery, sendRedirect, setCookie } from "h3"
import { useWorkOSAuth } from "../../../composables/useWorkOSAuth"
import { createErrorHandler } from "../../../utils/errors"

async function setUserSession(event: any, data: { user: any; accessToken: string }) {
	const sessionData = {
		user: data.user,
		accessToken: data.accessToken,
	}
	setCookie(event, "workos_session", JSON.stringify(sessionData), {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		path: "/",
	})
}

export default defineEventHandler(async (event) => {
	try {
		const { authenticateWithCode } = useWorkOSAuth()
		const query = getQuery(event)

		if (!query.code) {
			throw createError({
				statusCode: 400,
				statusMessage: "Authorization code is required",
			})
		}

		const { user, accessToken } = await authenticateWithCode(query.code as string)

		await setUserSession(event, {
			user,
			accessToken,
		})

		return sendRedirect(event, "/dashboard")
	} catch (error) {
		const handledError = createErrorHandler(error)
		throw createError({
			statusCode: 400,
			statusMessage: handledError.message,
		})
	}
})
