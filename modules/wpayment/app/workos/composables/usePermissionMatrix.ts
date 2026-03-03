import type { Role, PermissionCategory } from "../types/permissions"

export const usePermissionMatrix = () => {
	const searchQuery = ref("")
	const viewMode = ref<"grid" | "list">("grid")
	const showConflictModal = ref(false)
	const conflictMessage = ref("")
	const pendingChangesCount = ref(0)

	const roles = ref<Role[]>([
		{ id: "admin", name: "Admin", userCount: 3 },
		{ id: "manager", name: "Manager", userCount: 12 },
		{ id: "editor", name: "Editor", userCount: 28 },
		{ id: "viewer", name: "Viewer", userCount: 156 },
		{ id: "guest", name: "Guest", userCount: 45 },
	])

	const permissionCategories = ref<PermissionCategory[]>([
		{
			name: "Users", icon: "👥",
			permissions: [
				{ id: "users.read", name: "View Users", description: "View user profiles" },
				{ id: "users.create", name: "Create Users", description: "Create new users" },
				{ id: "users.update", name: "Edit Users", description: "Edit user profiles" },
				{ id: "users.delete", name: "Delete Users", description: "Delete users" },
			],
		},
		{
			name: "Organizations", icon: "🏢",
			permissions: [
				{ id: "org.read", name: "View Organization", description: "View organization details" },
				{ id: "org.update", name: "Edit Organization", description: "Edit organization settings" },
				{ id: "org.manage", name: "Manage Organization", description: "Full organization management" },
			],
		},
		{
			name: "Content", icon: "📄",
			permissions: [
				{ id: "content.read", name: "View Content", description: "View content" },
				{ id: "content.create", name: "Create Content", description: "Create new content" },
				{ id: "content.update", name: "Edit Content", description: "Edit existing content" },
				{ id: "content.delete", name: "Delete Content", description: "Delete content" },
				{ id: "content.publish", name: "Publish Content", description: "Publish content" },
			],
		},
		{
			name: "Settings", icon: "⚙️",
			permissions: [
				{ id: "settings.read", name: "View Settings", description: "View settings" },
				{ id: "settings.update", name: "Edit Settings", description: "Edit settings" },
			],
		},
		{
			name: "Audit", icon: "📋",
			permissions: [
				{ id: "audit.read", name: "View Audit Logs", description: "View audit logs" },
				{ id: "audit.export", name: "Export Audit Logs", description: "Export audit logs" },
			],
		},
	])

	const permissionMatrix = ref<Record<string, string[]>>({
		admin: ["users.read", "users.create", "users.update", "users.delete", "org.read", "org.update", "org.manage", "content.read", "content.create", "content.update", "content.delete", "content.publish", "settings.read", "settings.update", "audit.read", "audit.export"],
		manager: ["users.read", "users.create", "users.update", "org.read", "content.read", "content.create", "content.update", "content.publish", "audit.read"],
		editor: ["users.read", "content.read", "content.create", "content.update", "content.publish"],
		viewer: ["users.read", "content.read", "audit.read"],
		guest: ["content.read"],
	})

	const partialPermissions = ref<Record<string, string[]>>({
		manager: ["users.delete"],
		editor: ["content.delete"],
	})

	const filteredRoles = computed(() => {
		if (!searchQuery.value) return roles.value
		return roles.value.filter(role => role.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
	})

	const totalPermissions = computed(() => permissionCategories.value.reduce((sum, cat) => sum + cat.permissions.length, 0))
	const pendingChanges = computed(() => pendingChangesCount.value)

	const hasPermission = (roleId: string, permissionId: string) => permissionMatrix.value[roleId]?.includes(permissionId) ?? false
	const isPartialPermission = (roleId: string, permissionId: string) => partialPermissions.value[roleId]?.includes(permissionId) ?? false

	const togglePermission = (roleId: string, permissionId: string) => {
		const rolePermissions = permissionMatrix.value[roleId] || []
		const hasIt = rolePermissions.includes(permissionId)
		permissionMatrix.value[roleId] = hasIt ? rolePermissions.filter(p => p !== permissionId) : [...rolePermissions, permissionId]
		pendingChangesCount.value++
	}

	const exportMatrix = () => {
		const data = JSON.stringify(permissionMatrix.value, null, 2)
		const blob = new Blob([data], { type: "application/json" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = "permission-matrix.json"
		a.click()
		URL.revokeObjectURL(url)
	}

	const saveMatrix = async () => { pendingChangesCount.value = 0 }
	const forceApplyChange = () => { showConflictModal.value = false }

	return {
		searchQuery, viewMode, showConflictModal, conflictMessage, pendingChanges,
		roles, permissionCategories, permissionMatrix, partialPermissions,
		filteredRoles, totalPermissions, pendingChangesCount,
		hasPermission, isPartialPermission, togglePermission,
		exportMatrix, saveMatrix, forceApplyChange,
	}
}
