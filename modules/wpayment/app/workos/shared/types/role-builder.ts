export interface RoleFormData {
	id?: string
	name: string
	description: string
	organizationId: string
	permissions: string[]
}

export interface PermissionItem {
	id: string
	name: string
	description: string
	resource: string
	action: string
	category: string
}

export interface PermissionCategory {
	name: string
	permissions: PermissionItem[]
}

export interface OrganizationOption {
	id: string
	name: string
}
