<script setup lang="ts">
import type { User } from "../../composables/useAdminPortal"

const props = defineProps<{
  users: User[]
  search: string
  filter: string
  loading: boolean
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:filter': [value: string]
  invite: []
  select: [user: User]
  edit: [user: User]
  permissions: [user: User]
  remove: [user: User]
}>()

const search = computed({
  get: () => props.search,
  set: (value) => emit('update:search', value)
})

const filter = computed({
  get: () => props.filter,
  set: (value) => emit('update:filter', value)
})

const userColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
  { key: 'role', label: 'Role' },
  { key: 'lastActive', label: 'Last Active' },
  { key: 'actions', label: '' },
]
</script>

<template>
  <section class="tab-section">
    <div class="section-header">
      <h2>User Management</h2>
      <WorkOSButton variant="primary" @click="emit('invite')">Invite User</WorkOSButton>
    </div>
    <div class="filters-bar">
      <input v-model="search" type="text" placeholder="Search users..." class="search-input" />
      <select v-model="filter" class="filter-select">
        <option value="all">All Users</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
      </select>
    </div>
    <WorkOSDataTable
      :columns="userColumns"
      :data="users"
      :loading="loading"
      @row-click="emit('select', $event)"
    >
      <template #cell-status="{ row }">
        <span class="status-badge" :class="row.status">{{ row.status }}</span>
      </template>
      <template #cell-role="{ row }">
        <span class="role-badge">{{ row.role }}</span>
      </template>
      <template #cell-actions="{ row }">
        <div class="action-buttons">
          <button class="action-btn" title="Edit" @click.stop="emit('edit', row)">✏️</button>
          <button class="action-btn" title="Permissions" @click.stop="emit('permissions', row)">🔐</button>
          <button class="action-btn danger" title="Remove" @click.stop="emit('remove', row)">🗑️</button>
        </div>
      </template>
    </WorkOSDataTable>
  </section>
</template>

<style scoped>
.tab-section {
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2937;
}

.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.active {
  background: #d1fae5;
  color: #059669;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #dc2626;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.role-badge {
  padding: 0.25rem 0.5rem;
  background: #e5e7eb;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.action-btn:hover {
  opacity: 1;
}

.action-btn.danger:hover {
  color: #dc2626;
}
</style>
