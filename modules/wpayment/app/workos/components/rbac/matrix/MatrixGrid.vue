<script setup lang="ts">
import type { Role, PermissionCategory } from "../../types/permissions"

const props = defineProps<{
	roles: Role[]
	categories: PermissionCategory[]
	matrix: Record<string, string[]>
	partials: Record<string, string[]>
}>()

const emit = defineEmits<{
	toggle: [roleId: string, permissionId: string]
}>()

const hasPermission = (roleId: string, permissionId: string) => props.matrix[roleId]?.includes(permissionId) ?? false
const isPartial = (roleId: string, permissionId: string) => props.partials[roleId]?.includes(permissionId) ?? false
</script>

<template>
	<div class="matrix-grid-view">
		<div class="matrix-table">
			<div class="matrix-row header-row">
				<div class="matrix-cell corner"><span>Permissions / Roles</span></div>
				<div v-for="role in roles" :key="role.id" class="matrix-cell role-header">
					<span class="role-name">{{ role.name }}</span>
					<span class="role-users">{{ role.userCount }} users</span>
				</div>
			</div>

			<div v-for="category in categories" :key="category.name" class="category-section">
				<div class="category-header">
					<span class="category-icon">{{ category.icon }}</span>
					<span class="category-name">{{ category.name }}</span>
					<span class="category-count">{{ category.permissions.length }} permissions</span>
				</div>

				<div v-for="permission in category.permissions" :key="permission.id" class="matrix-row permission-row">
					<div class="matrix-cell permission-cell">
						<span class="permission-name">{{ permission.name }}</span>
						<span class="permission-desc">{{ permission.description }}</span>
					</div>
					<div
						v-for="role in roles"
						:key="role.id"
						class="matrix-cell"
						@click="emit('toggle', role.id, permission.id)"
					>
						<div
							:class="[
								'permission-toggle',
								{
									granted: hasPermission(role.id, permission.id),
									partial: isPartial(role.id, permission.id),
									denied: !hasPermission(role.id, permission.id) && !isPartial(role.id, permission.id),
								}
							]"
						>
							<span v-if="hasPermission(role.id, permission.id)">✓</span>
							<span v-else-if="isPartial(role.id, permission.id)">◐</span>
							<span v-else>✕</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.matrix-grid-view { overflow-x: auto; }
.matrix-table { display: flex; flex-direction: column; min-width: 800px; }
.matrix-row { display: flex; border-bottom: 1px solid #e5e7eb; }
.matrix-row.header-row { background: #f9fafb; position: sticky; top: 0; z-index: 10; }
.matrix-cell { padding: 0.75rem; min-width: 120px; display: flex; flex-direction: column; justify-content: center; }
.matrix-cell.corner { min-width: 250px; font-weight: 600; color: #374151; }
.matrix-cell.role-header { text-align: center; background: #f9fafb; }
.role-name { font-weight: 600; color: #1f2937; }
.role-users { font-size: 0.75rem; color: #6b7280; }
.category-section { margin-bottom: 1rem; }
.category-header { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #f3f4f6; border-radius: 6px; margin-bottom: 0.5rem; }
.category-icon { font-size: 1.25rem; }
.category-name { font-weight: 600; color: #1f2937; }
.category-count { font-size: 0.75rem; color: #6b7280; }
.permission-cell { min-width: 250px; }
.permission-name { font-weight: 500; color: #374151; }
.permission-desc { font-size: 0.75rem; color: #6b7280; }
.permission-toggle { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; margin: 0 auto; }
.permission-toggle.granted { background: #d1fae5; color: #059669; }
.permission-toggle.partial { background: #fef3c7; color: #d97706; }
.permission-toggle.denied { background: #fee2e2; color: #dc2626; }
.permission-toggle:hover { transform: scale(1.1); }
</style>
