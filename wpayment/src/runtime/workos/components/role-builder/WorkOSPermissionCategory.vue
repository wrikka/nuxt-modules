<template>
  <div class="category-section">
    <div class="category-header" @click="$emit('toggle')">
      <h4>{{ category.name }}</h4>
      <span class="category-toggle">{{ expanded ? "▼" : "▶" }}</span>
    </div>
    <div v-if="expanded" class="category-permissions">
      <div class="permission-actions">
        <WorkOSButton sm @click="$emit('selectAll')">Select All</WorkOSButton>
        <WorkOSButton sm @click="$emit('deselectAll')">Deselect All</WorkOSButton>
      </div>
      <div class="permission-list">
        <label v-for="permission in permissions" :key="permission.id" class="permission-checkbox">
          <input type="checkbox" :value="permission.id" :checked="selected.includes(permission.id)" @change="$emit('toggle', permission.id)" />
          <div class="permission-info">
            <span class="permission-name">{{ permission.name }}</span>
            <span class="permission-description">{{ permission.description }}</span>
            <div class="permission-details">
              <span>Resource: {{ permission.resource }}</span>
              <span>Action: {{ permission.action }}</span>
            </div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WorkOSButton from "../base/WorkOSButton.vue"
import type { Permission } from "../../shared/types/rbac"

defineProps<{
	category: { name: string; permissions: Permission[] }
	permissions: Permission[]
	selected: string[]
	expanded: boolean
}>()

defineEmits<{
	toggle: [permissionId?: string]
	selectAll: []
	deselectAll: []
}>()
</script>

<style scoped>
.category-section {
	margin-bottom: 1rem;
	border: 1px solid #e5e7eb;
	border-radius: 4px;
	overflow: hidden;
}

.category-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	background: #f9fafb;
	cursor: pointer;
	user-select: none;
}

.category-header:hover {
	background: #f3f4f6;
}

.category-header h4 {
	margin: 0;
	color: #374151;
}

.category-toggle {
	color: #6b7280;
	font-size: 0.875rem;
}

.category-permissions {
	padding: 1rem;
}

.permission-actions {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

.permission-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.permission-checkbox {
	display: flex;
	align-items: flex-start;
	padding: 1rem;
	cursor: pointer;
	border: 1px solid #e5e7eb;
	border-radius: 4px;
}

.permission-checkbox:hover {
	background: #f9fafb;
}

.permission-checkbox input {
	margin-right: 0.75rem;
	margin-top: 0.25rem;
}

.permission-info {
	flex: 1;
}

.permission-name {
	display: block;
	font-weight: 500;
	color: #1f2937;
	margin-bottom: 0.25rem;
}

.permission-description {
	display: block;
	color: #6b7280;
	font-size: 0.875rem;
	margin-bottom: 0.5rem;
}

.permission-details {
	display: flex;
	gap: 1rem;
	font-size: 0.75rem;
	color: #9ca3af;
}
</style>
