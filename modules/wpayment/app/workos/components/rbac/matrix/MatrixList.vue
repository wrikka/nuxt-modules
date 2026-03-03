<script setup lang="ts">
import type { Role, PermissionCategory } from "../../types/permissions"

const props = defineProps<{
	roles: Role[]
	categories: PermissionCategory[]
	matrix: Record<string, string[]>
}>()

const emit = defineEmits<{
	toggle: [roleId: string, permissionId: string]
}>()

const hasPermission = (roleId: string, permissionId: string) => props.matrix[roleId]?.includes(permissionId) ?? false
</script>

<template>
	<div class="matrix-list-view">
		<div v-for="role in roles" :key="role.id" class="role-card">
			<div class="role-header">
				<h3>{{ role.name }}</h3>
				<span class="user-count">{{ role.userCount }} users</span>
			</div>
			<div class="role-permissions">
				<div v-for="category in categories" :key="category.name" class="permission-group">
					<h4>{{ category.name }}</h4>
					<div class="permission-chips">
						<span
							v-for="permission in category.permissions"
							:key="permission.id"
							:class="['permission-chip', { granted: hasPermission(role.id, permission.id) }]"
							@click="emit('toggle', role.id, permission.id)"
						>
							{{ permission.name }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.matrix-list-view { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
.role-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; }
.role-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.role-header h3 { margin: 0; color: #1f2937; }
.user-count { color: #6b7280; font-size: 0.875rem; }
.permission-group { margin-bottom: 1rem; }
.permission-group h4 { margin: 0 0 0.5rem 0; color: #374151; font-size: 0.875rem; }
.permission-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.permission-chip { padding: 0.25rem 0.75rem; background: #f3f4f6; border-radius: 9999px; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; }
.permission-chip.granted { background: #d1fae5; color: #059669; }
.permission-chip:hover { background: #e5e7eb; }
</style>
