import { createError, defineEventHandler, readBody, setCookie } from "h3"
import type { H3Event } from "h3"
import { useWorkOSOrganizations } from "../../../composables"
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

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody(event)
	const { currentSessionId, targetOrganizationId, preserveCurrent } = body

	const storage = useStorage()
	const currentSession = await storage.getItem(`session:${currentSessionId}`) as MultiTenantSession
	if (!currentSession) {
		throw createError({
			statusCode: 404,
			statusMessage: "Current session not found",
		})
	}

	const { getOrganization } = useWorkOSOrganizations()

	const targetOrg = await getOrganization(targetOrganizationId)

	const newSession: MultiTenantSession = {
		...currentSession,
		id: generateSessionId(),
		organizationId: targetOrganizationId,
		organizationName: targetOrg.name,
		createdAt: new Date().toISOString(),
		lastAccessAt: new Date().toISOString(),
		expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
	}

	await storage.setItem(`session:${newSession.id}`, newSession)

	if (!preserveCurrent) {
		await storage.removeItem(`session:${currentSessionId}`)
	}

	setCookie(event, "workos_session_id", newSession.id, {
		httpOnly: true,
		secure: process.env["NODE_ENV"] === "production",
		sameSite: "lax",
		expires: new Date(newSession.expiresAt),
	})

	return newSession
})

const generateSessionId = (): string => {
	return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}
