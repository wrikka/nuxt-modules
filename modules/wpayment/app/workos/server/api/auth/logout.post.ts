import type { H3Event } from "h3"
import { createError, defineEventHandler, getCookie, setCookie } from "h3"
import { useWorkOSAuth } from "../../../composables/useWorkOSAuth"
import { createErrorHandler } from "../../../utils/errors"

async function getUserSession(event: H3Event): Promise<{ accessToken?: string } | null> {
	const session = getCookie(event, "workos_session")
	if (!session) return null
	try {
		const data = JSON.parse(session)
		return data
	} catch {
		return null
	}
}

async function clearUserSession(event: H3Event): Promise<void> {
	setCookie(event, "workos_session", "", {
		maxAge: 0,
		path: "/",
	})
}

export default defineEventHandler(async (event) => {
	try {
		const { logout } = useWorkOSAuth()
		const session = await getUserSession(event)

		if (session?.accessToken) {
			await logout(session.accessToken)
		}

		await clearUserSession(event)

		return { success: true }
	} catch (error) {
		const handledError = createErrorHandler(error)
		throw createError({
			statusCode: 400,
			statusMessage: handledError.message,
		})
	}
})
