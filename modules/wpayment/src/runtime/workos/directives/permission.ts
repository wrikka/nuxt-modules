import type { Directive, DirectiveBinding } from "vue"

interface PermissionValue {
	action: string
	resource?: string
}

/**
 * Permission Guard Directive
 *
 * Usage:
 * - Single permission: v-permission="'users:read'"
 * - Multiple permissions (OR): v-permission="['users:read', 'users:write']"
 * - Object syntax: v-permission="{ action: 'read', resource: 'users' }"
 * - With else slot: v-permission:else="'users:read'"
 */
export const vPermission: Directive<HTMLElement, string | string[] | PermissionValue> = {
	mounted(el: HTMLElement, binding: DirectiveBinding<string | string[] | PermissionValue>) {
		const { value, arg } = binding
		const hasPermission = checkPermission(value)

		if (!hasPermission) {
			if (arg === "else") {
				// Show else content
				el.style.display = ""
			} else {
				// Hide element
				el.style.display = "none"
				el.setAttribute("data-permission-hidden", "true")
			}
		} else {
			if (arg === "else") {
				el.style.display = "none"
			} else {
				el.style.display = ""
			}
		}
	},

	updated(el: HTMLElement, binding: DirectiveBinding<string | string[] | PermissionValue>) {
		const { value, arg } = binding
		const hasPermission = checkPermission(value)

		if (!hasPermission) {
			if (arg === "else") {
				el.style.display = ""
			} else {
				el.style.display = "none"
				el.setAttribute("data-permission-hidden", "true")
			}
		} else {
			if (arg === "else") {
				el.style.display = "none"
			} else {
				el.style.display = ""
				el.removeAttribute("data-permission-hidden")
			}
		}
	},
}

/**
 * Role Guard Directive
 *
 * Usage:
 * - Single role: v-role="'admin'"
 * - Multiple roles (OR): v-role="['admin', 'manager']"
 */
export const vRole: Directive<HTMLElement, string | string[]> = {
	mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
		const hasRole = checkRole(binding.value)
		el.style.display = hasRole ? "" : "none"
		if (!hasRole) {
			el.setAttribute("data-role-hidden", "true")
		}
	},

	updated(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
		const hasRole = checkRole(binding.value)
		el.style.display = hasRole ? "" : "none"
		if (hasRole) {
			el.removeAttribute("data-role-hidden")
		} else {
			el.setAttribute("data-role-hidden", "true")
		}
	},
}

/**
 * Feature Flag Directive
 *
 * Usage:
 * - v-feature="'new-dashboard'"
 * - v-feature="['feature-a', 'feature-b']"
 */
export const vFeature: Directive<HTMLElement, string | string[]> = {
	mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
		const hasFeature = checkFeature(binding.value)
		el.style.display = hasFeature ? "" : "none"
		if (!hasFeature) {
			el.setAttribute("data-feature-hidden", "true")
		}
	},

	updated(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
		const hasFeature = checkFeature(binding.value)
		el.style.display = hasFeature ? "" : "none"
		if (hasFeature) {
			el.removeAttribute("data-feature-hidden")
		} else {
			el.setAttribute("data-feature-hidden", "true")
		}
	},
}

/**
 * Organization Directive
 *
 * Usage:
 * - v-org="'org-123'"
 * - v-org="['org-123', 'org-456']"
 */
export const vOrg: Directive<HTMLElement, string | string[]> = {
	mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
		const isInOrg = checkOrganization(binding.value)
		el.style.display = isInOrg ? "" : "none"
		if (!isInOrg) {
			el.setAttribute("data-org-hidden", "true")
		}
	},

	updated(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
		const isInOrg = checkOrganization(binding.value)
		el.style.display = isInOrg ? "" : "none"
		if (isInOrg) {
			el.removeAttribute("data-org-hidden")
		} else {
			el.setAttribute("data-org-hidden", "true")
		}
	},
}

// Helper functions
function checkPermission(value: string | string[] | PermissionValue): boolean {
	const permissions = getActivePermissions()

	if (typeof value === "string") {
		return permissions.includes(value)
	}

	if (Array.isArray(value)) {
		return value.some((p) => permissions.includes(p))
	}

	if (typeof value === "object" && value !== null) {
		const { action, resource } = value
		if (resource) {
			return permissions.includes(`${resource}:${action}`)
		}
		return permissions.includes(action)
	}

	return false
}

function checkRole(value: string | string[]): boolean {
	const roles = getActiveRoles()

	if (typeof value === "string") {
		return roles.includes(value)
	}

	if (Array.isArray(value)) {
		return value.some((r) => roles.includes(r))
	}

	return false
}

function checkFeature(value: string | string[]): boolean {
	const features = getActiveFeatures()

	if (typeof value === "string") {
		return features.includes(value)
	}

	if (Array.isArray(value)) {
		return value.some((f) => features.includes(f))
	}

	return false
}

function checkOrganization(value: string | string[]): boolean {
	const orgs = getActiveOrganizations()

	if (typeof value === "string") {
		return orgs.includes(value)
	}

	if (Array.isArray(value)) {
		return value.some((o) => orgs.includes(o))
	}

	return false
}

// These functions should be implemented by the application
// They will be overridden by the plugin
let getActivePermissions = (): string[] => []
let getActiveRoles = (): string[] => []
let getActiveFeatures = (): string[] => []
let getActiveOrganizations = (): string[] => []

/**
 * Configure the permission directive with custom getters
 */
export function configurePermissionDirectives(config: {
	getPermissions: () => string[]
	getRoles: () => string[]
	getFeatures?: () => string[]
	getOrganizations?: () => string[]
}) {
	getActivePermissions = config.getPermissions
	getActiveRoles = config.getRoles
	if (config.getFeatures) {
		getActiveFeatures = config.getFeatures
	}
	if (config.getOrganizations) {
		getActiveOrganizations = config.getOrganizations
	}
}

// Export all directives
export const permissionDirectives = {
	permission: vPermission,
	role: vRole,
	feature: vFeature,
	org: vOrg,
}
