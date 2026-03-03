<script setup lang="ts">
import { ref, computed } from '#imports';
import type { Role, Permission, PermissionResource, PermissionAction } from '#feature-flags/types';
import { DEFAULT_ROLES } from '#feature-flags/types/permissions';

const roles = ref<Role[]>([...DEFAULT_ROLES]);
const selectedRole = ref<Role | null>(null);
const isEditing = ref(false);

const resources: PermissionResource[] = ['flag', 'experiment', 'environment', 'audit', 'settings'];
const actions: PermissionAction[] = ['create', 'read', 'update', 'delete', 'enable', 'disable', 'export'];

const selectRole = (role: Role) => {
  selectedRole.value = role;
  isEditing.value = false;
};

const hasPermission = (resource: PermissionResource, action: PermissionAction) => {
  if (!selectedRole.value) return false;
  return selectedRole.value.permissions.some(
    (p) => p.resource === resource && p.actions.includes(action),
  );
};

const togglePermission = (resource: PermissionResource, action: PermissionAction) => {
  if (!selectedRole.value || selectedRole.value.isDefault) return;

  const roleIndex = roles.value.findIndex((r) => r.id === selectedRole.value!.id);
  const permissionIndex = selectedRole.value.permissions.findIndex(
    (p) => p.resource === resource,
  );

  if (permissionIndex === -1) {
    selectedRole.value.permissions.push({
      id: `${resource}-${action}`,
      name: `${action} ${resource}`,
      description: `${action} access to ${resource}`,
      resource,
      actions: [action],
    });
  } else {
    const perm = selectedRole.value.permissions[permissionIndex];
    const actionIndex = perm.actions.indexOf(action);

    if (actionIndex === -1) {
      perm.actions.push(action);
    } else {
      perm.actions.splice(actionIndex, 1);
      if (perm.actions.length === 0) {
        selectedRole.value.permissions.splice(permissionIndex, 1);
      }
    }
  }

  roles.value[roleIndex] = { ...selectedRole.value, updatedAt: Date.now() };
};

const createRole = () => {
  const newRole: Role = {
    id: `role-${Date.now()}`,
    name: 'New Role',
    description: 'Custom role',
    permissions: [],
    isDefault: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  roles.value.push(newRole);
  selectedRole.value = newRole;
  isEditing.value = true;
};

const deleteRole = (role: Role) => {
  if (role.isDefault) return;
  const index = roles.value.findIndex((r) => r.id === role.id);
  if (index !== -1) {
    roles.value.splice(index, 1);
    if (selectedRole.value?.id === role.id) {
      selectedRole.value = null;
    }
  }
};

const getRoleColor = (roleId: string) => {
  const colors: Record<string, string> = {
    admin: '#ef4444',
    developer: '#3b82f6',
    viewer: '#6b7280',
  };
  return colors[roleId] || '#10b981';
};
</script>

<template>
  <div class="rp-container">
    <div class="rp-header">
      <h3>Permissions & Roles</h3>
      <button class="rp-btn rp-btn-primary" @click="createRole">
        + New Role
      </button>
    </div>

    <div class="rp-layout">
      <div class="rp-roles">
        <div class="rp-roles-header">
          <span>Roles</span>
        </div>
        <div class="rp-role-list">
          <div
            v-for="role in roles"
            :key="role.id"
            class="rp-role-item"
            :class="{ 'rp-selected': selectedRole?.id === role.id }"
            @click="selectRole(role)"
          >
            <div
              class="rp-role-indicator"
              :style="{ background: getRoleColor(role.id) }"
            />
            <div class="rp-role-info">
              <span class="rp-role-name">{{ role.name }}</span>
              <span class="rp-role-desc">{{ role.description }}</span>
            </div>
            <span v-if="role.isDefault" class="rp-default-badge">Default</span>
            <button
              v-if="!role.isDefault"
              class="rp-btn-icon rp-danger"
              @click.stop="deleteRole(role)"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div v-if="selectedRole" class="rp-permissions">
        <div class="rp-permissions-header">
          <div>
            <h4>{{ selectedRole.name }}</h4>
            <p>{{ selectedRole.description }}</p>
          </div>
          <span v-if="selectedRole.isDefault" class="rp-readonly-badge">
            Read Only
          </span>
        </div>

        <div class="rp-matrix">
          <div class="rp-matrix-header">
            <span class="rp-matrix-corner">Resource / Action</span>
            <span v-for="action in actions" :key="action" class="rp-matrix-action">
              {{ action }}
            </span>
          </div>
          <div
            v-for="resource in resources"
            :key="resource"
            class="rp-matrix-row"
          >
            <span class="rp-matrix-resource">{{ resource }}</span>
            <div
              v-for="action in actions"
              :key="action"
              class="rp-matrix-cell"
              :class="{
                'rp-granted': hasPermission(resource, action),
                'rp-readonly': selectedRole.isDefault
              }"
              @click="togglePermission(resource, action)"
            >
              {{ hasPermission(resource, action) ? '✓' : '' }}
            </div>
          </div>
        </div>

        <div class="rp-permission-count">
          {{ selectedRole.permissions.reduce((sum, p) => sum + p.actions.length, 0) }} permissions granted
        </div>
      </div>

      <div v-else class="rp-empty">
        <p>Select a role to view permissions</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rp-container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
}

.rp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.rp-header h3 {
  margin: 0;
  font-size: 1.125rem;
}

.rp-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.rp-btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.rp-btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
  color: #6b7280;
}

.rp-btn-icon.rp-danger:hover {
  color: #ef4444;
}

.rp-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 1rem;
}

.rp-roles {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.rp-roles-header {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.rp-role-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.rp-role-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  border: 1px solid transparent;
}

.rp-role-item:hover {
  border-color: #e5e7eb;
}

.rp-role-item.rp-selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.rp-role-indicator {
  width: 4px;
  height: 32px;
  border-radius: 2px;
}

.rp-role-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.rp-role-name {
  font-size: 0.875rem;
  font-weight: 500;
}

.rp-role-desc {
  font-size: 0.75rem;
  color: #6b7280;
}

.rp-default-badge {
  font-size: 0.625rem;
  background: #e5e7eb;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.rp-permissions {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.rp-permissions-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.rp-permissions-header h4 {
  margin: 0;
  font-size: 1rem;
}

.rp-permissions-header p {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.rp-readonly-badge {
  font-size: 0.625rem;
  background: #fef3c7;
  color: #92400e;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.rp-matrix {
  overflow-x: auto;
}

.rp-matrix-header {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
}

.rp-matrix-corner {
  width: 100px;
  font-size: 0.75rem;
  color: #6b7280;
}

.rp-matrix-action {
  width: 70px;
  text-align: center;
  font-size: 0.625rem;
  color: #6b7280;
  text-transform: capitalize;
}

.rp-matrix-row {
  display: flex;
  align-items: center;
  padding: 0.375rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.rp-matrix-resource {
  width: 100px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.rp-matrix-cell {
  width: 70px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6b7280;
}

.rp-matrix-cell.rp-granted {
  background: #d1fae5;
  color: #10b981;
}

.rp-matrix-cell.rp-readonly {
  cursor: not-allowed;
  opacity: 0.7;
}

.rp-permission-count {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
}

.rp-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 0.5rem;
  color: #9ca3af;
}
</style>
