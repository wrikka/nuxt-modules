<template>
  <div class="admin-portal">
    <!-- Header -->
    <header class="portal-header">
      <div class="header-left">
        <h1>Admin Portal</h1>
        <WorkOSOrgSwitcher :current-org="currentOrg" :organizations="organizations" @switch="switchOrg" />
      </div>
      <div class="header-right">
        <WorkOSUserAvatar :user="currentUser" :show-status="true" :show-role="true" />
        <WorkOSButton variant="secondary" @click="logout">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </template>
          Logout
        </WorkOSButton>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <nav class="portal-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="nav-tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" />
        {{ tab.label }}
      </button>
    </nav>

    <!-- Tab Content -->
    <main class="portal-content">
      <!-- Users Tab -->
      <section v-if="activeTab === 'users'" class="tab-section">
        <div class="section-header">
          <h2>User Management</h2>
          <WorkOSButton variant="primary" @click="showInviteModal = true">Invite User</WorkOSButton>
        </div>
        <div class="filters-bar">
          <input v-model="userSearch" type="text" placeholder="Search users..." class="search-input" />
          <select v-model="userFilter" class="filter-select">
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <WorkOSDataTable
          :columns="userColumns"
          :data="filteredUsers"
          :loading="loadingUsers"
          @row-click="selectUser"
        >
          <template #cell-status="{ row }">
            <span class="status-badge" :class="row.status">{{ row.status }}</span>
          </template>
          <template #cell-role="{ row }">
            <span class="role-badge">{{ row.role }}</span>
          </template>
          <template #cell-actions="{ row }">
            <div class="action-buttons">
              <button class="action-btn" title="Edit" @click.stop="editUser(row)">✏️</button>
              <button class="action-btn" title="Permissions" @click.stop="showPermissions(row)">🔐</button>
              <button class="action-btn danger" title="Remove" @click.stop="removeUser(row)">🗑️</button>
            </div>
          </template>
        </WorkOSDataTable>
      </section>

      <!-- Organizations Tab -->
      <section v-if="activeTab === 'organizations'" class="tab-section">
        <div class="section-header">
          <h2>Organizations</h2>
          <WorkOSButton variant="primary" @click="showCreateOrgModal = true">Create Organization</WorkOSButton>
        </div>
        <div class="org-grid">
          <div v-for="org in organizations" :key="org.id" class="org-card" @click="selectOrg(org)">
            <div class="org-logo">{{ org.name.charAt(0) }}</div>
            <div class="org-info">
              <h3>{{ org.name }}</h3>
              <p>{{ (org as any).memberCount || 0 }} members</p>
              <span class="org-status active">active</span>
            </div>
            <div class="org-stats">
              <div class="stat">
                <span class="stat-value">{{ (org as any).activeUsers || 0 }}</span>
                <span class="stat-label">Active</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ (org as any).ssoConnections || 0 }}</span>
                <span class="stat-label">SSO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Roles & Permissions Tab -->
      <section v-if="activeTab === 'roles'" class="tab-section">
        <div class="section-header">
          <h2>Roles & Permissions</h2>
          <WorkOSButton variant="primary" @click="showCreateRoleModal = true">Create Role</WorkOSButton>
        </div>
        <WorkOSPermissionMatrix
          :roles="roles"
          :permissions="permissions"
          :assignments="roleAssignments"
          @update="updatePermission"
        />
      </section>

      <!-- Security Tab -->
      <section v-if="activeTab === 'security'" class="tab-section">
        <WorkOSSecurityDashboard :organization-id="currentOrg?.id" />
      </section>

      <!-- Audit Logs Tab -->
      <section v-if="activeTab === 'audit'" class="tab-section">
        <WorkOSAuditLogViewer :organization-id="currentOrg?.id" />
      </section>

      <!-- Settings Tab -->
      <section v-if="activeTab === 'settings'" class="tab-section">
        <div class="settings-grid">
          <div class="settings-card">
            <h3>Authentication Settings</h3>
            <div class="setting-item">
              <label>Session Timeout (minutes)</label>
              <input v-model="settings.sessionTimeout" type="number" min="5" max="1440" />
            </div>
            <div class="setting-item">
              <label>Require MFA</label>
              <input v-model="settings.requireMfa" type="checkbox" />
            </div>
            <div class="setting-item">
              <label>Password Policy</label>
              <select v-model="settings.passwordPolicy">
                <option value="standard">Standard</option>
                <option value="strong">Strong</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          <div class="settings-card">
            <h3>SSO Settings</h3>
            <div class="setting-item">
              <label>Auto-provision users</label>
              <input v-model="settings.autoProvision" type="checkbox" />
            </div>
            <div class="setting-item">
              <label>Default role for new users</label>
              <select v-model="settings.defaultRole">
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
              </select>
            </div>
          </div>
          <div class="settings-card">
            <h3>Notifications</h3>
            <div class="setting-item">
              <label>Email notifications</label>
              <input v-model="settings.emailNotifications" type="checkbox" />
            </div>
            <div class="setting-item">
              <label>Webhook URL</label>
              <input v-model="settings.webhookUrl" type="url" placeholder="https://" />
            </div>
          </div>
        </div>
        <div class="settings-actions">
          <WorkOSButton variant="secondary" @click="resetSettings">Reset to Defaults</WorkOSButton>
          <WorkOSButton variant="primary" @click="saveSettings">Save Settings</WorkOSButton>
        </div>
      </section>
    </main>

    <!-- Modals -->
    <WorkOSModal :show="showInviteModal" title="Invite User" @close="showInviteModal = false">
      <form class="invite-form" @submit.prevent="sendInvite">
        <div class="form-group">
          <label>Email</label>
          <input v-model="inviteForm.email" type="email" required />
        </div>
        <div class="form-group">
          <label>Role</label>
          <select v-model="inviteForm.roleId" required>
            <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
          </select>
        </div>
        <div class="form-actions">
          <WorkOSButton variant="secondary" type="button" @click="showInviteModal = false">Cancel</WorkOSButton>
          <WorkOSButton variant="primary" type="submit">Send Invite</WorkOSButton>
        </div>
      </form>
    </WorkOSModal>

    <WorkOSModal :show="showCreateOrgModal" title="Create Organization" @close="showCreateOrgModal = false">
      <form class="create-org-form" @submit.prevent="createOrg">
        <div class="form-group">
          <label>Organization Name</label>
          <input v-model="orgForm.name" type="text" required />
        </div>
        <div class="form-group">
          <label>Domain</label>
          <input v-model="orgForm.domain" type="text" placeholder="company.com" />
        </div>
        <div class="form-actions">
          <WorkOSButton variant="secondary" type="button" @click="showCreateOrgModal = false">Cancel</WorkOSButton>
          <WorkOSButton variant="primary" type="submit">Create</WorkOSButton>
        </div>
      </form>
    </WorkOSModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import type { Organization, User } from "../shared/types"
import WorkOSButton from "./base/WorkOSButton.vue"
import WorkOSDataTable from "./base/WorkOSDataTable.vue"
import WorkOSModal from "./base/WorkOSModal.vue"
import WorkOSOrgSwitcher from "./WorkOSOrgSwitcher.vue"
import WorkOSUserAvatar from "./WorkOSUserAvatar.vue"
import WorkOSPermissionMatrix from "./WorkOSPermissionMatrix.vue"
import WorkOSSecurityDashboard from "./WorkOSSecurityDashboard.vue"
import WorkOSAuditLogViewer from "./WorkOSAuditLogViewer.vue"
import { useWorkOSOrganizations, useWorkOSRBAC, useWorkOSAuth, useWorkOSInvitations } from "../composables"

interface Tab {
  id: string
  label: string
  icon: string
}

const tabs: Tab[] = [
  { id: "users", label: "Users", icon: "UsersIcon" },
  { id: "organizations", label: "Organizations", icon: "OrgIcon" },
  { id: "roles", label: "Roles & Permissions", icon: "RolesIcon" },
  { id: "security", label: "Security", icon: "SecurityIcon" },
  { id: "audit", label: "Audit Logs", icon: "AuditIcon" },
  { id: "settings", label: "Settings", icon: "SettingsIcon" },
]

const userColumns = [
  { key: "email", label: "Email" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "lastLogin", label: "Last Login" },
  { key: "actions", label: "" },
]

const activeTab = ref("users")
const userSearch = ref("")
const userFilter = ref("all")
const loadingUsers = ref(false)
const showInviteModal = ref(false)
const showCreateOrgModal = ref(false)
const showCreateRoleModal = ref(false)

const currentUser = ref<User | null>(null)
const currentOrg = ref<Organization | null>(null)
const organizations = ref<Organization[]>([])
const users = ref<any[]>([])
const roles = ref<any[]>([])
const permissions = ref<string[]>([])
const roleAssignments = ref<Record<string, string[]>>({})

const inviteForm = ref({
  email: "",
  roleId: "",
})

const orgForm = ref({
  name: "",
  domain: "",
})

const settings = ref({
  sessionTimeout: 60,
  requireMfa: false,
  passwordPolicy: "standard",
  autoProvision: true,
  defaultRole: "",
  emailNotifications: true,
  webhookUrl: "",
})

const { listOrganizations, createOrganization } = useWorkOSOrganizations()
const { getRoles, getPermissions } = useWorkOSRBAC()
const { logout: logoutUser } = useWorkOSAuth()
const { createInvitation } = useWorkOSInvitations()

const filteredUsers = computed(() => {
  let result = users.value
  if (userSearch.value) {
    const search = userSearch.value.toLowerCase()
    result = result.filter(
      (u) =>
        u.email.toLowerCase().includes(search) ||
        u.firstName.toLowerCase().includes(search) ||
        u.lastName.toLowerCase().includes(search)
    )
  }
  if (userFilter.value !== "all") {
    result = result.filter((u) => u.status === userFilter.value)
  }
  return result
})

const switchOrg = async (orgId: string) => {
  const org = organizations.value.find((o) => o.id === orgId)
  if (org) {
    currentOrg.value = org as unknown as Organization
    await loadData()
  }
}

const selectUser = (user: any) => {
  console.log("Selected user:", user)
}

const editUser = (user: any) => {
  console.log("Edit user:", user)
}

const showPermissions = (user: any) => {
  console.log("Show permissions for:", user)
}

const removeUser = async (user: any) => {
  if (confirm(`Remove ${user.email} from organization?`)) {
    console.log("Remove user:", user)
  }
}

const selectOrg = (org: any) => {
  currentOrg.value = org
  activeTab.value = "users"
}

const sendInvite = async () => {
  if (currentOrg.value) {
    await createInvitation({
      email: inviteForm.value.email,
      organizationId: currentOrg.value.id,
      roleId: inviteForm.value.roleId,
    })
    showInviteModal.value = false
    inviteForm.value = { email: "", roleId: "" }
    await loadUsers()
  }
}

const createOrg = async () => {
  await createOrganization({
    name: orgForm.value.name,
    domainData: orgForm.value.domain ? [{ domain: orgForm.value.domain, state: "pending" as const }] : undefined,
  })
  showCreateOrgModal.value = false
  orgForm.value = { name: "", domain: "" }
  await loadOrganizations()
}

const updatePermission = async (data: { roleId: string; permission: string; granted: boolean }) => {
  console.log("Update permission:", data)
}

const saveSettings = async () => {
  console.log("Save settings:", settings.value)
}

const resetSettings = () => {
  settings.value = {
    sessionTimeout: 60,
    requireMfa: false,
    passwordPolicy: "standard",
    autoProvision: true,
    defaultRole: "",
    emailNotifications: true,
    webhookUrl: "",
  }
}

const logout = async () => {
  try {
    const session = await $fetch<{ id: string }>("/api/workos/sessions/current")
    if (session?.id) {
      await logoutUser(session.id)
    }
  } catch {
    // Ignore logout errors
  }
}

const loadOrganizations = async () => {
  const result = await listOrganizations()
  organizations.value = result.data || []
  if (organizations.value[0]) {
    currentOrg.value = organizations.value[0] as unknown as Organization
  }
}

const loadUsers = async () => {
  loadingUsers.value = true
  try {
    const result = await $fetch("/api/workos/users", {
      query: { organizationId: currentOrg.value?.id },
    })
    users.value = result as any[]
  } finally {
    loadingUsers.value = false
  }
}

const loadRoles = async () => {
  if (currentOrg.value) {
    roles.value = await getRoles(currentOrg.value.id)
    const permsResult = await getPermissions(currentOrg.value.id)
    permissions.value = permsResult.map((p: any) => typeof p === "string" ? p : p.name || p.id)
  }
}

const loadData = async () => {
  await Promise.all([loadUsers(), loadRoles()])
}

onMounted(async () => {
  await loadOrganizations()
  if (currentOrg.value) {
    await loadData()
  }
})
</script>

<style scoped>
.admin-portal {
  min-height: 100vh;
  background: #f9fafb;
}

.portal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-left h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.portal-nav {
  display: flex;
  gap: 0.5rem;
  padding: 0 2rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.nav-tab:hover {
  color: #111827;
}

.nav-tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.portal-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.tab-section {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
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
  color: #111827;
}

.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  background: #f3f4f6;
  border-radius: 0.25rem;
  cursor: pointer;
}

.action-btn:hover {
  background: #e5e7eb;
}

.action-btn.danger:hover {
  background: #fee2e2;
}

.org-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.org-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.org-card:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.org-logo {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  color: white;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.org-info {
  flex: 1;
}

.org-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  color: #111827;
}

.org-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.org-status {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.org-status.active {
  background: #d1fae5;
  color: #065f46;
}

.org-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.settings-card {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.settings-card h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
  color: #111827;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item label {
  font-size: 0.875rem;
  color: #374151;
}

.setting-item input[type="number"],
.setting-item input[type="text"],
.setting-item input[type="url"],
.setting-item select {
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.setting-item input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.invite-form,
.create-org-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
