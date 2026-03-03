export interface MultiTenantSession {
	id: string
	userId: string
	organizationId: string
	organizationName: string
	role: string
	permissions: string[]
	isActive: boolean
	createdAt: string
	lastAccessAt: string
	expiresAt: string
}

export interface SessionSwitchOptions {
	organizationId: string
	preserveCurrent?: boolean
}
