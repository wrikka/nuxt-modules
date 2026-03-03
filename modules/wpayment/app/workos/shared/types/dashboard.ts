export interface WorkOSDashboardStats {
	totalUsers: number
	activeSessions: number
	totalOrganizations: number
	totalConnections: number
}

export interface WorkOSDashboardUser {
	id: string
	email: string
	firstName?: string
	lastName?: string
	profilePictureUrl?: string
	organizationName: string
	role: string
	lastAccessAt: string
	[key: string]: unknown
}

export interface WorkOSOrganizationSession {
	id: string
	organizationName: string
	userName: string
	role: string
	isActive: boolean
	createdAt: string
	expiresAt: string
	[key: string]: unknown
}

export interface WorkOSNewUserData {
	email: string
	firstName: string
	lastName: string
	organizationId: string
	roleId: string
}
