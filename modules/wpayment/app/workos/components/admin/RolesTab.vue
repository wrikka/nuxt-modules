<script setup lang="ts">
import type { Role } from "../../composables/useAdminPortal"

const props = defineProps<{
  roles: Role[]
}>()

const emit = defineEmits<{
  create: []
  edit: [role: Role]
  delete: [role: Role]
}>()
</script>

<template>
  <section class="tab-section">
    <div class="section-header">
      <h2>Role Management</h2>
      <WorkOSButton variant="primary" @click="emit('create')">Create Role</WorkOSButton>
    </div>
    <div class="roles-list">
      <div v-for="role in roles" :key="role.id" class="role-card">
        <div class="role-header">
          <div class="role-info">
            <h3>{{ role.name }}</h3>
            <span v-if="role.isSystem" class="system-badge">System</span>
          </div>
          <span class="user-count">{{ role.userCount }} users</span>
        </div>
        <p class="role-description">{{ role.description }}</p>
        <div class="role-permissions">
          <span v-for="perm in role.permissions" :key="perm" class="permission-tag">
            {{ perm }}
          </span>
        </div>
        <div class="role-actions">
          <WorkOSButton variant="secondary" sm @click="emit('edit', role)">Edit</WorkOSButton>
          <WorkOSButton v-if="!role.isSystem" variant="danger" sm @click="emit('delete', role)">
            Delete
          </WorkOSButton>
        </div>
      </div>
    </div>
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

.roles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}

.role-card {
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.role-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.role-info h3 {
  margin: 0;
  font-size: 1rem;
  color: #1f2937;
}

.system-badge {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  background: #e5e7eb;
  border-radius: 4px;
  color: #6b7280;
}

.user-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.role-description {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.role-permissions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.permission-tag {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background: #dbeafe;
  color: #2563eb;
  border-radius: 4px;
  text-transform: capitalize;
}

.role-actions {
  display: flex;
  gap: 0.5rem;
}
</style>
