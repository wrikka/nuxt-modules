export interface Role {
	id: string
	name: string
	userCount: number
}

export interface Permission {
	id: string
	name: string
	description: string
}

export interface PermissionCategory {
	name: string
	icon: string
	permissions: Permission[]
}
