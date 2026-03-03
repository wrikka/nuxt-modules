export interface Role {
	id: string
	name: string
	description: string
	organizationId: string
	permissions: string[]
	isSystem: boolean
	createdAt: string
	updatedAt: string
}

export interface Permission {
	id: string
	name: string
	description: string
	category: string
	resource: string
	action: string
	conditions?: Record<string, unknown>
	isSystem: boolean
	createdAt: string
	updatedAt: string
}

export interface UserRole {
	userId: string
	roleId: string
	organizationId: string
	assignedBy: string
	assignedAt: string
	expiresAt?: string
	conditions?: Record<string, unknown>
}

export interface AccessCheckOptions {
	resource: string
	action: string
	context?: Record<string, unknown>
	organizationId?: string
}
