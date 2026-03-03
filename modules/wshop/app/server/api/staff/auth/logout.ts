// d:/wshop/server/api/staff/auth/logout.ts

import { lucia } from "~~/server/utils/auth"

export default defineEventHandler(async (event) => {
	const method = getMethod(event)
	if (method !== "POST") {
		throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
	}

	// Invalidate the session
	const sessionId = getCookie(event, lucia.sessionCookieName)
	if (sessionId) {
		await lucia.invalidateSession(sessionId)
	}

	// Create a blank session cookie to remove it from the browser
	const sessionCookie = lucia.createBlankSessionCookie()
	appendHeader(event, "Set-Cookie", sessionCookie.serialize())

	return { success: true, message: "Logged out successfully" }
})
