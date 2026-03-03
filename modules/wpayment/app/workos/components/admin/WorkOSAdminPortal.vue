<script setup lang="ts">
import WorkOSButton from "./base/WorkOSButton.vue"
import WorkOSOrgSwitcher from "./WorkOSOrgSwitcher.vue"
import WorkOSUserAvatar from "./WorkOSUserAvatar.vue"
import WorkOSSecurityDashboard from "./WorkOSSecurityDashboard.vue"
import WorkOSAuditLogViewer from "./WorkOSAuditLogViewer.vue"
import WorkOSPermissionMatrix from "./WorkOSPermissionMatrix.vue"
import UsersTab from "./admin/UsersTab.vue"
import OrganizationsTab from "./admin/OrganizationsTab.vue"
import RolesTab from "./admin/RolesTab.vue"
import SettingsTab from "./admin/SettingsTab.vue"

const {
  activeTab,
  tabs,
  users,
  userSearch,
  userFilter,
  loadingUsers,
  filteredUsers,
  organizations,
  currentOrg,
  roles,
  currentUser,
} = useAdminPortal()

const {
  showInviteModal,
  showCreateOrgModal,
  openInviteModal,
  closeInviteModal,
  openCreateOrgModal,
  closeCreateOrgModal,
} = useAdminModals()

const {
  switchOrg,
  logout,
  selectUser,
  editUser,
  showPermissions,
  removeUser,
  selectOrg,
  editRole,
  deleteRole,
  createRole,
} = useAdminActions()

const permissions = ref<string[]>([])
const roleAssignments = ref<Record<string, string[]>>({})

const updatePermission = async (data: { roleId: string; permission: string; granted: boolean }) => {
  console.log("Update permission:", data)
}

const saveSettings = async (settings: any) => {
  console.log("Save settings:", settings)
}

const resetSettings = () => {
  console.log("Reset settings")
}

const sendInvite = async () => {
  closeInviteModal()
}

const createOrg = async () => {
  closeCreateOrgModal()
}
</script>

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
        <WorkOSButton variant="secondary" @click="logout">Logout</WorkOSButton>
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
        {{ tab.label }}
      </button>
    </nav>

    <!-- Tab Content -->
    <main class="portal-content">
      <UsersTab
        v-if="activeTab === 'users'"
        v-model:search="userSearch"
        v-model:filter="userFilter"
        :users="filteredUsers"
        :loading="loadingUsers"
        @invite="openInviteModal"
        @select="selectUser"
        @edit="editUser"
        @permissions="showPermissions"
        @remove="removeUser"
      />

      <OrganizationsTab
        v-if="activeTab === 'organizations'"
        :organizations="organizations"
        @create="openCreateOrgModal"
        @select="selectOrg"
      />

      <RolesTab
        v-if="activeTab === 'roles'"
        :roles="roles"
        @create="createRole"
        @edit="editRole"
        @delete="deleteRole"
      />

      <section v-if="activeTab === 'security'" class="tab-section">
        <WorkOSSecurityDashboard :organization-id="currentOrg?.id" />
      </section>

      <section v-if="activeTab === 'audit'" class="tab-section">
        <WorkOSAuditLogViewer :organization-id="currentOrg?.id" />
      </section>

      <SettingsTab
        v-if="activeTab === 'settings'"
        :roles="roles"
        @save="saveSettings"
        @reset="resetSettings"
      />
    </main>

    <!-- Modals -->
    <WorkOSModal :show="showInviteModal" title="Invite User" @close="closeInviteModal">
      <form class="modal-form" @submit.prevent="sendInvite">
        <div class="form-group">
          <label>Email</label>
          <input type="email" required />
        </div>
        <div class="form-group">
          <label>Role</label>
          <select required>
            <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
          </select>
        </div>
        <div class="form-actions">
          <WorkOSButton variant="secondary" type="button" @click="closeInviteModal">Cancel</WorkOSButton>
          <WorkOSButton variant="primary" type="submit">Send Invite</WorkOSButton>
        </div>
      </form>
    </WorkOSModal>

    <WorkOSModal :show="showCreateOrgModal" title="Create Organization" @close="closeCreateOrgModal">
      <form class="modal-form" @submit.prevent="createOrg">
        <div class="form-group">
          <label>Organization Name</label>
          <input type="text" required />
        </div>
        <div class="form-group">
          <label>Domain</label>
          <input type="text" placeholder="company.com" />
        </div>
        <div class="form-actions">
          <WorkOSButton variant="secondary" type="button" @click="closeCreateOrgModal">Cancel</WorkOSButton>
          <WorkOSButton variant="primary" type="submit">Create</WorkOSButton>
        </div>
      </form>
    </WorkOSModal>
  </div>
</template>

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
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
}

.modal-form {
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
  border-radius: 6px;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
