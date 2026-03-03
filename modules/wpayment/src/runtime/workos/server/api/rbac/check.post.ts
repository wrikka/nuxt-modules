import { defineEventHandler, readBody } from "h3"
import type { H3Event } from "h3"
import type { AccessCheckOptions } from "../../../shared/types/rbac"

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

interface CheckRequestBody extends AccessCheckOptions {
	userId: string
	organizationId: string
}

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody<CheckRequestBody>(event)
	const { userId, organizationId, resource, action, context } = body
	const storage = useStorage()

	const userRoles = (await storage.getItem(`user_roles:${userId}:${organizationId}`)) as any[] || []
	const allPermissions = new Set<string>()

	for (const userRole of userRoles) {
		if (userRole.expiresAt && new Date(userRole.expiresAt) < new Date()) {
			continue
		}

		const role = await storage.getItem(`role:${userRole.roleId}`) as any
		if (role) {
			role.permissions.forEach((permissionId: string) => {
				allPermissions.add(permissionId)
			})
		}
	}

	const permissions = []
	for (const permissionId of allPermissions) {
		const permission = await storage.getItem(`permission:${permissionId}`) as any
		if (permission) {
			permissions.push(permission)
		}
	}

	const hasAccess = permissions.some(permission => {
		if (permission.resource !== resource || permission.action !== action) {
			return false
		}

		if (permission.conditions) {
			return evaluateConditions(permission.conditions, context || {})
		}

		return true
	})

	return {
		allowed: hasAccess,
		reason: hasAccess ? "Permission granted" : "Insufficient permissions",
	}
})

const evaluateConditions = (
	conditions: Record<string, any>,
	context: Record<string, any>,
): boolean => {
	for (const [key, value] of Object.entries(conditions)) {
		if (context[key] !== value) {
			return false
		}
	}
	return true
}
