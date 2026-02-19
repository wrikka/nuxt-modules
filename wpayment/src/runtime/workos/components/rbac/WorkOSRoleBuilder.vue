<template>
  <div class="role-builder">
    <div class="builder-header">
      <h2>Role Builder</h2>
      <div class="header-actions">
        <WorkOSButton variant="primary" :disabled="!isRoleValid" @click="saveRole">
          {{ isEditing ? "Update Role" : "Create Role" }}
        </WorkOSButton>
        <WorkOSButton variant="secondary" @click="resetForm">Reset</WorkOSButton>
      </div>
    </div>

    <div class="builder-content">
      <div class="form-section">
        <h3>Basic Information</h3>
        <div class="form-group">
          <label>Role Name *</label>
          <input v-model="role.name" type="text" placeholder="e.g., Admin, Manager, User" required />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="role.description" placeholder="Describe the role and its responsibilities"></textarea>
        </div>
        <div class="form-group">
          <label>Organization</label>
          <select v-model="role.organizationId" required>
            <option value="">Select Organization</option>
            <option v-for="org in organizations" :key="org.id" :value="org.id">
              {{ org.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="permissions-section">
        <h3>Permissions</h3>
        <div class="permission-search">
          <input v-model="permissionSearch" type="text" placeholder="Search permissions..." @input="filterPermissions" />
        </div>

        <div class="permission-categories">
          <WorkOSPermissionCategory
            v-for="category in permissionCategories"
            :key="category.name"
            :category="category"
            :permissions="filteredPermissions[category.name] ?? []"
            :selected="role.permissions"
            :expanded="expandedCategories.includes(category.name)"
            @toggle="toggleCategory(category.name)"
            @select-all="selectAllInCategory(category)"
            @deselect-all="deselectAllInCategory(category)"
          />
        </div>

        <div class="selected-permissions">
          <h4>Selected Permissions ({{ role.permissions.length }})</h4>
          <div class="selected-list">
            <div v-for="id in role.permissions" :key="id" class="selected-permission">
              <span>{{ getPermissionName(id) }}</span>
              <button class="btn-icon" @click="removePermission(id)">✕</button>
            </div>
          </div>
        </div>
      </div>

      <div class="preview-section">
        <h3>Preview</h3>
        <WorkOSRolePreview :role="role" :permissions="permissions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import type { Permission } from "../shared/types/rbac"
import { useWorkOSOrganizations, useWorkOSRBAC } from "../composables"
import WorkOSButton from "./base/WorkOSButton.vue"
import WorkOSPermissionCategory from "./role-builder/WorkOSPermissionCategory.vue"
import WorkOSRolePreview from "./role-builder/WorkOSRolePreview.vue"

interface PermissionCategory {
  name: string
  permissions: Permission[]
}

interface RoleFormData {
  id?: string
  name: string
  description: string
  organizationId: string
  permissions: string[]
}

interface OrganizationOption {
  id: string
  name: string
}

const role = ref<RoleFormData>({
  name: "",
  description: "",
  organizationId: "",
  permissions: [],
})

const organizations = ref<OrganizationOption[]>([])
const permissions = ref<Permission[]>([])
const permissionSearch = ref("")
const expandedCategories = ref<string[]>([])
const isEditing = ref(false)

const { createRole, getPermissions, updateRole } = useWorkOSRBAC()
const { listOrganizations } = useWorkOSOrganizations()

const permissionCategories = computed<PermissionCategory[]>(() => {
	const categories = new Set(permissions.value.map((p: Permission) => p.category))
	return Array.from(categories).map((name) => ({
		name,
		permissions: permissions.value.filter((p: Permission) => p.category === name),
	}))
})

const filteredPermissions = computed<Record<string, Permission[]>>(() => {
	const filtered: Record<string, Permission[]> = {}
	permissionCategories.value.forEach((category) => {
		filtered[category.name] = category.permissions.filter(
			(permission) =>
				permission.name.toLowerCase().includes(permissionSearch.value.toLowerCase()) ||
				permission.description.toLowerCase().includes(permissionSearch.value.toLowerCase()) ||
				permission.resource.toLowerCase().includes(permissionSearch.value.toLowerCase()) ||
				permission.action.toLowerCase().includes(permissionSearch.value.toLowerCase()),
		)
	})
	return filtered
})

const isRoleValid = computed(() => {
	return role.value.name.trim() !== "" && role.value.organizationId !== "" && role.value.permissions.length > 0
})

const toggleCategory = (categoryName: string) => {
	const index = expandedCategories.value.indexOf(categoryName)
	if (index > -1) {
		expandedCategories.value.splice(index, 1)
	} else {
		expandedCategories.value.push(categoryName)
	}
}

const selectAllInCategory = (category: PermissionCategory) => {
	category.permissions.forEach((permission) => {
		if (!role.value.permissions.includes(permission.id)) {
			role.value.permissions.push(permission.id)
		}
	})
}

const deselectAllInCategory = (category: PermissionCategory) => {
	category.permissions.forEach((permission) => {
		const index = role.value.permissions.indexOf(permission.id)
		if (index > -1) {
			role.value.permissions.splice(index, 1)
		}
	})
}

const removePermission = (permissionId: string) => {
	const index = role.value.permissions.indexOf(permissionId)
	if (index > -1) {
		role.value.permissions.splice(index, 1)
	}
}

const getPermissionName = (permissionId: string): string => {
	const permission = permissions.value.find((p: Permission) => p.id === permissionId)
	return permission ? permission.name : permissionId
}

const filterPermissions = () => {
	if (permissionSearch.value.trim() !== "") {
		permissionCategories.value.forEach((category) => {
			const hasMatch = category.permissions.some(
				(permission) =>
					permission.name.toLowerCase().includes(permissionSearch.value.toLowerCase()) ||
					permission.description.toLowerCase().includes(permissionSearch.value.toLowerCase()),
			)
			if (hasMatch && !expandedCategories.value.includes(category.name)) {
				expandedCategories.value.push(category.name)
			}
		})
	}
}

const saveRole = async () => {
	try {
		if (isEditing.value && role.value.id) {
			await updateRole(role.value.id, role.value)
		} else {
			await createRole(role.value)
		}
		await navigateTo("/admin/roles")
	} catch (error) {
		console.error("Failed to save role:", error)
	}
}

const resetForm = () => {
	role.value = { name: "", description: "", organizationId: "", permissions: [] }
	isEditing.value = false
	expandedCategories.value = []
	permissionSearch.value = ""
}

const loadData = async () => {
	try {
		const [orgsData, permsData] = await Promise.all([listOrganizations(), getPermissions()])
		organizations.value = orgsData.data || []
		permissions.value = permsData
		if (permissionCategories.value.length > 0) {
			expandedCategories.value.push(permissionCategories.value[0]?.name ?? "")
		}
	} catch (error) {
		console.error("Failed to load data:", error)
	}
}

onMounted(() => {
	loadData()
})
</script>

<style scoped>
.role-builder {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
}

.builder-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
}

.builder-header h2 {
	margin: 0;
	color: #1f2937;
}

.header-actions {
	display: flex;
	gap: 1rem;
}

.builder-content {
	display: grid;
	grid-template-columns: 1fr 2fr 1fr;
	gap: 2rem;
}

.form-section,
.permissions-section,
.preview-section {
	background: white;
	border-radius: 8px;
	padding: 1.5rem;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-section h3,
.permissions-section h3,
.preview-section h3 {
	margin: 0 0 1rem 0;
	color: #1f2937;
}

.form-group {
	margin-bottom: 1rem;
}

.form-group label {
	display: block;
	margin-bottom: 0.5rem;
	font-weight: 500;
	color: #374151;
}

.form-group input,
.form-group textarea,
.form-group select {
	width: 100%;
	padding: 0.5rem;
	border: 1px solid #d1d5db;
	border-radius: 4px;
	font-size: 1rem;
}

.form-group textarea {
	resize: vertical;
	min-height: 80px;
}

.permission-search {
	margin-bottom: 1rem;
}

.permission-search input {
	width: 100%;
	padding: 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 4px;
	font-size: 1rem;
}

.permission-categories {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.selected-permissions {
	margin-top: 2rem;
	padding-top: 1rem;
	border-top: 1px solid #e5e7eb;
}

.selected-permissions h4 {
	margin: 0 0 1rem 0;
	color: #374151;
}

.selected-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.selected-permission {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 0.75rem;
	background: #eff6ff;
	color: #1e40af;
	border-radius: 9999px;
	font-size: 0.875rem;
}

.btn-icon {
	background: none;
	border: none;
	cursor: pointer;
	color: #6b7280;
	padding: 0.25rem;
	border-radius: 2px;
}

.btn-icon:hover {
	background: #dbeafe;
	color: #1e40af;
}
</style>
