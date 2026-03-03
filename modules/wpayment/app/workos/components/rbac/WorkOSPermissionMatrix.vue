<script setup lang="ts">
import { usePermissionMatrix } from "../../../composables/usePermissionMatrix"
import WorkOSButton from "../base/WorkOSButton.vue"
import WorkOSModal from "../base/WorkOSModal.vue"
import MatrixGrid from "./matrix/MatrixGrid.vue"
import MatrixList from "./matrix/MatrixList.vue"

const {
	searchQuery, viewMode, showConflictModal, conflictMessage, pendingChanges,
	roles, permissionCategories, permissionMatrix, partialPermissions,
	filteredRoles, totalPermissions, pendingChangesCount,
	hasPermission, isPartialPermission, togglePermission,
	exportMatrix, saveMatrix, forceApplyChange,
} = usePermissionMatrix()
</script>

<template>
	<div class="permission-matrix">
		<div class="matrix-header">
			<h2>Permission Matrix</h2>
			<div class="header-actions">
				<WorkOSButton variant="secondary" @click="exportMatrix">Export</WorkOSButton>
				<WorkOSButton variant="primary" @click="saveMatrix">Save Changes</WorkOSButton>
			</div>
		</div>

		<div class="matrix-controls">
			<div class="search-filter">
				<input v-model="searchQuery" type="text" placeholder="Search roles or permissions..." />
			</div>
			<div class="view-toggle">
				<button :class="['toggle-btn', { active: viewMode === 'grid' }]" @click="viewMode = 'grid'">Grid View</button>
				<button :class="['toggle-btn', { active: viewMode === 'list' }]" @click="viewMode = 'list'">List View</button>
			</div>
		</div>

		<MatrixGrid
			v-if="viewMode === 'grid'"
			:roles="filteredRoles"
			:categories="permissionCategories"
			:matrix="permissionMatrix"
			:partials="partialPermissions"
			@toggle="togglePermission"
		/>
		<MatrixList
			v-else
			:roles="filteredRoles"
			:categories="permissionCategories"
			:matrix="permissionMatrix"
			@toggle="togglePermission"
		/>

		<div class="matrix-summary">
			<div class="summary-item"><span class="summary-label">Total Roles</span><span class="summary-value">{{ roles.length }}</span></div>
			<div class="summary-item"><span class="summary-label">Total Permissions</span><span class="summary-value">{{ totalPermissions }}</span></div>
			<div class="summary-item"><span class="summary-label">Changes Pending</span><span class="summary-value changes">{{ pendingChanges }}</span></div>
		</div>

		<WorkOSModal :show="showConflictModal" title="Permission Conflict" @close="showConflictModal = false">
			<p>This permission change may conflict with existing role assignments.</p>
			<p class="conflict-detail">{{ conflictMessage }}</p>
			<template #footer>
				<WorkOSButton variant="secondary" @click="showConflictModal = false">Cancel</WorkOSButton>
				<WorkOSButton variant="primary" @click="forceApplyChange">Apply Anyway</WorkOSButton>
			</template>
		</WorkOSModal>
	</div>
</template>

<style scoped>
.permission-matrix { max-width: 1200px; margin: 0 auto; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.matrix-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.matrix-header h2 { margin: 0; color: #1f2937; }
.header-actions { display: flex; gap: 0.75rem; }
.matrix-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; }
.search-filter input { padding: 0.5rem 1rem; border: 1px solid #e5e7eb; border-radius: 6px; width: 300px; }
.view-toggle { display: flex; gap: 0.5rem; }
.toggle-btn { padding: 0.5rem 1rem; border: 1px solid #e5e7eb; background: white; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
.toggle-btn.active { background: #2563eb; color: white; border-color: #2563eb; }
.matrix-summary { display: flex; justify-content: flex-end; gap: 2rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
.summary-item { display: flex; flex-direction: column; align-items: center; }
.summary-label { font-size: 0.75rem; color: #6b7280; }
.summary-value { font-size: 1.5rem; font-weight: 600; color: #1f2937; }
.summary-value.changes { color: #f59e0b; }
.conflict-detail { background: #fef3c7; padding: 0.75rem; border-radius: 4px; margin-top: 1rem; font-size: 0.875rem; }
</style>
