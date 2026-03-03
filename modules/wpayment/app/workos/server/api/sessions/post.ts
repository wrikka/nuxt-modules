import { defineEventHandler, readBody, setCookie } from "h3"
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
	const body = await readBody(event)
	const storage = useStorage()
	const session: MultiTenantSession = {
		...body,
		id: generateSessionId(),
		isActive: true,
		createdAt: new Date().toISOString(),
		lastAccessAt: new Date().toISOString(),
	}

	await storage.setItem(`session:${session.id}`, session)
	setCookie(event, "workos_session_id", session.id, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		expires: new Date(session.expiresAt),
	})

	return session
})

const generateSessionId = (): string => {
	return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}
