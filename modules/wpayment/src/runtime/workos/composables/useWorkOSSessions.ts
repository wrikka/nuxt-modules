import type { MultiTenantSession, SessionSwitchOptions } from "../shared/types/sessions"
import { generateSessionId } from "../utils"

export type { MultiTenantSession, SessionSwitchOptions }

export const useWorkOSSessions = () => {
	const createSession = async (data: {
		userId: string
		organizationId: string
		organizationName: string
		role: string
		permissions: string[]
		expiresIn?: number
	}): Promise<MultiTenantSession> => {
		const session: MultiTenantSession = {
			id: generateSessionId(),
			userId: data.userId,
			organizationId: data.organizationId,
			organizationName: data.organizationName,
			role: data.role,
			permissions: data.permissions,
			isActive: true,
			createdAt: new Date().toISOString(),
			lastAccessAt: new Date().toISOString(),
			expiresAt: new Date(Date.now() + (data.expiresIn || 24 * 60 * 60 * 1000)).toISOString(),
		}

		await $fetch("/api/workos/sessions", {
			method: "POST",
			body: session,
		})

		return session
	}

	const switchOrganization = async (options: SessionSwitchOptions): Promise<MultiTenantSession> => {
		const currentSession = await getCurrentSession()

		if (!currentSession) {
			throw new Error("No active session found")
		}

		const response = await $fetch<MultiTenantSession>("/api/workos/sessions/switch", {
			method: "POST",
			body: {
				currentSessionId: currentSession.id,
				targetOrganizationId: options.organizationId,
				preserveCurrent: options.preserveCurrent || false,
			},
		})

		return response
	}

	const getCurrentSession = async (): Promise<MultiTenantSession | null> => {
		try {
			return await $fetch<MultiTenantSession>("/api/workos/sessions/current")
		} catch {
			return null
		}
	}

	const getUserSessions = async (userId?: string): Promise<MultiTenantSession[]> => {
		return await $fetch<MultiTenantSession[]>("/api/workos/sessions", {
			query: { userId: userId || "current" },
		})
	}

	const revokeSession = async (sessionId: string): Promise<void> => {
		await $fetch(`/api/workos/sessions/${sessionId}`, {
			method: "DELETE",
		})
	}

	const revokeAllSessions = async (userId?: string): Promise<void> => {
		await $fetch("/api/workos/sessions/revoke-all", {
			method: "POST",
			body: { userId: userId || "current" },
		})
	}

	const refreshSession = async (sessionId?: string): Promise<MultiTenantSession> => {
		return await $fetch<MultiTenantSession>("/api/workos/sessions/refresh", {
			method: "POST",
			body: { sessionId },
		})
	}

	const validateSession = async (sessionId: string): Promise<boolean> => {
		try {
			await $fetch(`/api/workos/sessions/${sessionId}/validate`)
			return true
		} catch {
			return false
		}
	}

	return {
		createSession,
		switchOrganization,
		getCurrentSession,
		getUserSessions,
		revokeSession,
		revokeAllSessions,
		refreshSession,
		validateSession,
	}
}
