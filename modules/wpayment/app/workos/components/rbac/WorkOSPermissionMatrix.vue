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
        <button
          :class="['toggle-btn', { active: viewMode === 'grid' }]"
          @click="viewMode = 'grid'"
        >
          Grid View
        </button>
        <button
          :class="['toggle-btn', { active: viewMode === 'list' }]"
          @click="viewMode = 'list'"
        >
          List View
        </button>
      </div>
    </div>

    <div v-if="viewMode === 'grid'" class="matrix-grid">
      <div class="matrix-table">
        <div class="matrix-row header-row">
          <div class="matrix-cell corner">
            <span>Permissions / Roles</span>
          </div>
          <div
            v-for="role in filteredRoles"
            :key="role.id"
            class="matrix-cell role-header"
          >
            <span class="role-name">{{ role.name }}</span>
            <span class="role-users">{{ role.userCount }} users</span>
          </div>
        </div>

        <div
          v-for="category in permissionCategories"
          :key="category.name"
          class="category-section"
        >
          <div class="category-header">
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
            <span class="category-count">{{ category.permissions.length }} permissions</span>
          </div>

          <div
            v-for="permission in category.permissions"
            :key="permission.id"
            class="matrix-row permission-row"
          >
            <div class="matrix-cell permission-cell">
              <span class="permission-name">{{ permission.name }}</span>
              <span class="permission-desc">{{ permission.description }}</span>
            </div>
            <div
              v-for="role in filteredRoles"
              :key="role.id"
              class="matrix-cell"
              @click="togglePermission(role.id, permission.id)"
            >
              <div
                :class="[
                  'permission-toggle',
                  {
                    granted: hasPermission(role.id, permission.id),
                    partial: isPartialPermission(role.id, permission.id),
                    denied: !hasPermission(role.id, permission.id) && !isPartialPermission(role.id, permission.id),
                  },
                ]"
              >
                <span v-if="hasPermission(role.id, permission.id)">✓</span>
                <span v-else-if="isPartialPermission(role.id, permission.id)">◐</span>
                <span v-else>✕</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="matrix-list">
      <div
        v-for="role in filteredRoles"
        :key="role.id"
        class="role-card"
      >
        <div class="role-header">
          <h3>{{ role.name }}</h3>
          <span class="user-count">{{ role.userCount }} users</span>
        </div>
        <div class="role-permissions">
          <div
            v-for="category in permissionCategories"
            :key="category.name"
            class="permission-group"
          >
            <h4>{{ category.name }}</h4>
            <div class="permission-chips">
              <span
                v-for="permission in category.permissions"
                :key="permission.id"
                :class="[
                  'permission-chip',
                  { granted: hasPermission(role.id, permission.id) },
                ]"
                @click="togglePermission(role.id, permission.id)"
              >
                {{ permission.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="matrix-summary">
      <div class="summary-item">
        <span class="summary-label">Total Roles</span>
        <span class="summary-value">{{ roles.length }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Total Permissions</span>
        <span class="summary-value">{{ totalPermissions }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Changes Pending</span>
        <span class="summary-value changes">{{ pendingChanges }}</span>
      </div>
    </div>

    <WorkOSModal
      :show="showConflictModal"
      title="Permission Conflict"
      @close="showConflictModal = false"
    >
      <p>This permission change may conflict with existing role assignments.</p>
      <p class="conflict-detail">{{ conflictMessage }}</p>
      <template #footer>
        <WorkOSButton variant="secondary" @click="showConflictModal = false">
          Cancel
        </WorkOSButton>
        <WorkOSButton variant="primary" @click="forceApplyChange">
          Apply Anyway
        </WorkOSButton>
      </template>
    </WorkOSModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import WorkOSButton from "./base/WorkOSButton.vue"
import WorkOSModal from "./base/WorkOSModal.vue"

interface Role {
  id: string
  name: string
  userCount: number
}

interface Permission {
  id: string
  name: string
  description: string
}

interface PermissionCategory {
  name: string
  icon: string
  permissions: Permission[]
}

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
    name: "Users",
    icon: "👥",
    permissions: [
      { id: "users.read", name: "View Users", description: "View user profiles" },
      { id: "users.create", name: "Create Users", description: "Create new users" },
      { id: "users.update", name: "Edit Users", description: "Edit user profiles" },
      { id: "users.delete", name: "Delete Users", description: "Delete users" },
    ],
  },
  {
    name: "Organizations",
    icon: "🏢",
    permissions: [
      { id: "org.read", name: "View Organization", description: "View organization details" },
      { id: "org.update", name: "Edit Organization", description: "Edit organization settings" },
      { id: "org.manage", name: "Manage Organization", description: "Full organization management" },
    ],
  },
  {
    name: "Content",
    icon: "📄",
    permissions: [
      { id: "content.read", name: "View Content", description: "View content" },
      { id: "content.create", name: "Create Content", description: "Create new content" },
      { id: "content.update", name: "Edit Content", description: "Edit existing content" },
      { id: "content.delete", name: "Delete Content", description: "Delete content" },
      { id: "content.publish", name: "Publish Content", description: "Publish content" },
    ],
  },
  {
    name: "Settings",
    icon: "⚙️",
    permissions: [
      { id: "settings.read", name: "View Settings", description: "View settings" },
      { id: "settings.update", name: "Edit Settings", description: "Edit settings" },
    ],
  },
  {
    name: "Audit",
    icon: "📋",
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
  return roles.value.filter(role =>
    role.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalPermissions = computed(() => {
  return permissionCategories.value.reduce((sum, cat) => sum + cat.permissions.length, 0)
})

const pendingChanges = computed(() => pendingChangesCount.value)

const hasPermission = (roleId: string, permissionId: string) => {
  return permissionMatrix.value[roleId]?.includes(permissionId) ?? false
}

const isPartialPermission = (roleId: string, permissionId: string) => {
  return partialPermissions.value[roleId]?.includes(permissionId) ?? false
}

const togglePermission = (roleId: string, permissionId: string) => {
  const rolePermissions = permissionMatrix.value[roleId] || []
  const hasIt = rolePermissions.includes(permissionId)

  if (hasIt) {
    permissionMatrix.value[roleId] = rolePermissions.filter(p => p !== permissionId)
  } else {
    permissionMatrix.value[roleId] = [...rolePermissions, permissionId]
  }

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

const saveMatrix = async () => {
  pendingChangesCount.value = 0
}

const forceApplyChange = () => {
  showConflictModal.value = false
}
</script>

<style scoped>
.permission-matrix {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.matrix-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.matrix-header h2 {
  margin: 0;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.matrix-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.search-filter input {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  width: 300px;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.matrix-grid {
  overflow-x: auto;
}

.matrix-table {
  display: flex;
  flex-direction: column;
  min-width: 800px;
}

.matrix-row {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
}

.matrix-row.header-row {
  background: #f9fafb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.matrix-cell {
  padding: 0.75rem;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.matrix-cell.corner {
  min-width: 250px;
  font-weight: 600;
  color: #374151;
}

.matrix-cell.role-header {
  text-align: center;
  background: #f9fafb;
}

.role-name {
  font-weight: 600;
  color: #1f2937;
}

.role-users {
  font-size: 0.75rem;
  color: #6b7280;
}

.category-section {
  margin-bottom: 1rem;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.category-icon {
  font-size: 1.25rem;
}

.category-name {
  font-weight: 600;
  color: #1f2937;
}

.category-count {
  font-size: 0.75rem;
  color: #6b7280;
}

.permission-cell {
  min-width: 250px;
}

.permission-name {
  font-weight: 500;
  color: #374151;
}

.permission-desc {
  font-size: 0.75rem;
  color: #6b7280;
}

.permission-toggle {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0 auto;
}

.permission-toggle.granted {
  background: #d1fae5;
  color: #059669;
}

.permission-toggle.partial {
  background: #fef3c7;
  color: #d97706;
}

.permission-toggle.denied {
  background: #fee2e2;
  color: #dc2626;
}

.permission-toggle:hover {
  transform: scale(1.1);
}

.matrix-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.role-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.role-card .role-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.role-card h3 {
  margin: 0;
  color: #1f2937;
}

.user-count {
  color: #6b7280;
  font-size: 0.875rem;
}

.permission-group {
  margin-bottom: 1rem;
}

.permission-group h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 0.875rem;
}

.permission-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.permission-chip {
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  border-radius: 9999px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.permission-chip.granted {
  background: #d1fae5;
  color: #059669;
}

.permission-chip:hover {
  background: #e5e7eb;
}

.matrix-summary {
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.summary-value.changes {
  color: #f59e0b;
}

.conflict-detail {
  background: #fef3c7;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  font-size: 0.875rem;
}
</style>
