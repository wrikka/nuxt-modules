import type { AccessCheckOptions, Permission, Role, UserRole } from "../shared/types/rbac"

export const useWorkOSRBAC = () => {
	const createRole = async (data: {
		name: string
		description: string
		organizationId: string
		permissions: string[]
	}): Promise<Role> => {
		return await $fetch<Role>("/api/workos/rbac/roles", {
			method: "POST",
			body: {
				...data,
				isSystem: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		})
	}

	const updateRole = async (roleId: string, data: Partial<Role>): Promise<Role> => {
		return await $fetch<Role>(`/api/workos/rbac/roles/${roleId}`, {
			method: "PUT",
			body: {
				...data,
				updatedAt: new Date().toISOString(),
			},
		})
	}

	const deleteRole = async (roleId: string): Promise<void> => {
		await $fetch(`/api/workos/rbac/roles/${roleId}`, {
			method: "DELETE",
		})
	}

	const getRoles = async (organizationId: string): Promise<Role[]> => {
		return await $fetch<Role[]>("/api/workos/rbac/roles", {
			query: { organizationId },
		})
	}

	const getRole = async (roleId: string): Promise<Role> => {
		return await $fetch<Role>(`/api/workos/rbac/roles/${roleId}`)
	}

	const createPermission = async (data: {
		name: string
		description: string
		resource: string
		action: string
		conditions?: Record<string, unknown>
	}): Promise<Permission> => {
		return await $fetch<Permission>("/api/workos/rbac/permissions", {
			method: "POST",
			body: {
				...data,
				isSystem: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		})
	}

	const getPermissions = async (organizationId?: string): Promise<Permission[]> => {
		return await $fetch<Permission[]>("/api/workos/rbac/permissions", {
			query: { organizationId },
		})
	}

	const assignRole = async (data: {
		userId: string
		roleId: string
		organizationId: string
		expiresAt?: string
		conditions?: Record<string, unknown>
	}): Promise<UserRole> => {
		const session = await $fetch<{ userId: string }>("/api/workos/sessions/current")

		return await $fetch<UserRole>("/api/workos/rbac/assignments", {
			method: "POST",
			body: {
				...data,
				assignedBy: session.userId,
				assignedAt: new Date().toISOString(),
			},
		})
	}

	const revokeRole = async (
		userId: string,
		roleId: string,
		organizationId: string,
	): Promise<void> => {
		await $fetch("/api/workos/rbac/assignments/revoke", {
			method: "POST",
			body: { userId, roleId, organizationId },
		})
	}

	const getUserRoles = async (userId: string, organizationId?: string): Promise<UserRole[]> => {
		return await $fetch<UserRole[]>("/api/workos/rbac/assignments", {
			query: { userId, organizationId },
		})
	}

	const checkPermission = async (options: AccessCheckOptions): Promise<boolean> => {
		try {
			const session = await $fetch<{ userId: string; organizationId: string }>(
				"/api/workos/sessions/current",
			)

			const result = await $fetch<{ allowed: boolean; reason?: string }>("/api/workos/rbac/check", {
				method: "POST",
				body: {
					userId: session.userId,
					organizationId: options.organizationId || session.organizationId,
					...options,
				},
			})

			return result.allowed
		} catch {
			return false
		}
	}

	const getUserPermissions = async (
		userId: string,
		organizationId: string,
	): Promise<Permission[]> => {
		return await $fetch<Permission[]>("/api/workos/rbac/user-permissions", {
			query: { userId, organizationId },
		})
	}

	const hasPermission = (permissions: Permission[], resource: string, action: string): boolean => {
		return permissions.some(permission =>
			permission.resource === resource
			&& permission.action === action
		)
	}

	const hasAnyPermission = (
		permissions: Permission[],
		checks: Array<{ resource: string; action: string }>,
	): boolean => {
		return checks.some(check => hasPermission(permissions, check.resource, check.action))
	}

	const hasAllPermissions = (
		permissions: Permission[],
		checks: Array<{ resource: string; action: string }>,
	): boolean => {
		return checks.every(check => hasPermission(permissions, check.resource, check.action))
	}

	return {
		createRole,
		updateRole,
		deleteRole,
		getRoles,
		getRole,
		createPermission,
		getPermissions,
		assignRole,
		revokeRole,
		getUserRoles,
		checkPermission,
		getUserPermissions,
		hasPermission,
		hasAnyPermission,
		hasAllPermissions,
	}
}
