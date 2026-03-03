<template>
  <div class="role-preview">
    <div class="preview-header">
      <h4>{{ role.name || "Untitled Role" }}</h4>
      <span class="permission-count">{{ role.permissions.length }} permissions</span>
    </div>
    <p v-if="role.description">{{ role.description }}</p>
    <div class="preview-permissions">
      <div v-for="id in role.permissions.slice(0, 5)" :key="id" class="preview-permission">
        {{ getPermissionName(id) }}
      </div>
      <div v-if="role.permissions.length > 5" class="preview-more">
        +{{ role.permissions.length - 5 }} more
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Permission } from "../../shared/types/rbac"

interface RoleFormData {
	id?: string
	name: string
	description: string
	organizationId: string
	permissions: string[]
}

const props = defineProps<{
	role: RoleFormData
	permissions: Permission[]
}>()

const getPermissionName = (id: string): string => {
	const permission = props.permissions.find((p) => p.id === id)
	return permission?.name ?? id
}
</script>

<style scoped>
.role-preview {
	border: 1px solid #e5e7eb;
	border-radius: 4px;
	padding: 1rem;
}

.preview-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.5rem;
}

.preview-header h4 {
	margin: 0;
	color: #1f2937;
}

.permission-count {
	font-size: 0.875rem;
	color: #6b7280;
}

.preview-permissions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-top: 1rem;
}

.preview-permission {
	padding: 0.25rem 0.5rem;
	background: #f3f4f6;
	color: #374151;
	border-radius: 4px;
	font-size: 0.75rem;
}

.preview-more {
	padding: 0.25rem 0.5rem;
	background: #e5e7eb;
	color: #6b7280;
	border-radius: 4px;
	font-size: 0.75rem;
}
</style>
