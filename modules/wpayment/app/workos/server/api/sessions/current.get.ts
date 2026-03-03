import { createError, defineEventHandler, deleteCookie, getCookie } from "h3"
import type { MultiTenantSession } from "../../../composables/useWorkOSSessions"

// Simple in-memory storage for development
const storage = new Map<string, any>()
const useStorage = () => ({
	getItem: async (key: string) => storage.get(key),
	setItem: async (key: string, value: any) => {
		storage.set(key, value)
	},
	removeItem: async (key: string) => {
		storage.delete(key)
	},
})

export default defineEventHandler(async (event) => {
	const sessionId = getCookie(event, "workos_session_id")

	if (!sessionId) {
		throw createError({
			statusCode: 401,
			statusMessage: "No session found",
		})
	}

	// Use Nitro storage
	const storage = useStorage()
	const session = await storage.getItem(`session:${sessionId}`) as MultiTenantSession

	if (!session || !session.isActive || new Date(session.expiresAt) < new Date()) {
		deleteCookie(event, "workos_session_id")
		throw createError({
			statusCode: 401,
			statusMessage: "Session expired or invalid",
		})
	}

	session.lastAccessAt = new Date().toISOString()
	await storage.setItem(`session:${sessionId}`, session)

	return session
})
