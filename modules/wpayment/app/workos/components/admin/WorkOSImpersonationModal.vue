<template>
  <WorkOSModal :show="show" title="User Impersonation" large @close="$emit('close')">
    <div class="impersonation-modal">
      <div class="warning-banner">
        <span class="warning-icon">⚠️</span>
        <p>Impersonation will be logged for audit purposes. All actions taken will be attributed to the impersonated user.</p>
      </div>

      <div class="user-search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search users by name or email..."
          @input="searchUsers"
        />
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Searching users...</p>
      </div>

      <div v-else-if="filteredUsers.length === 0 && searchQuery" class="empty-state">
        <p>No users found</p>
      </div>

      <div v-else class="users-list">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          :class="['user-item', { selected: selectedUser?.id === user.id }]"
          @click="selectUser(user)"
        >
          <div class="user-avatar">
            <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
            <div v-else class="avatar-placeholder">{{ getInitials(user.name) }}</div>
          </div>
          <div class="user-info">
            <h4>{{ user.name }}</h4>
            <p>{{ user.email }}</p>
            <div class="user-meta">
              <span class="role-badge">{{ user.role }}</span>
              <span v-if="user.organization" class="org-badge">{{ user.organization }}</span>
            </div>
          </div>
          <div class="user-status">
            <span :class="['status-dot', user.status]"></span>
            <span>{{ user.status }}</span>
          </div>
        </div>
      </div>

      <div v-if="selectedUser" class="selected-user-panel">
        <h4>Selected User</h4>
        <div class="selected-info">
          <div class="info-row">
            <span class="label">Name:</span>
            <span class="value">{{ selectedUser.name }}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ selectedUser.email }}</span>
          </div>
          <div class="info-row">
            <span class="label">Role:</span>
            <span class="value">{{ selectedUser.role }}</span>
          </div>
          <div class="info-row">
            <span class="label">Organization:</span>
            <span class="value">{{ selectedUser.organization }}</span>
          </div>
          <div class="info-row">
            <span class="label">Last Login:</span>
            <span class="value">{{ formatLastLogin(selectedUser.lastLogin) }}</span>
          </div>
        </div>

        <div class="impersonation-options">
          <label class="checkbox-label">
            <input v-model="impersonationOptions.notifyUser" type="checkbox" />
            <span>Notify user via email</span>
          </label>
          <label class="checkbox-label">
            <input v-model="impersonationOptions.timeout" type="checkbox" />
            <span>Auto-end session after 30 minutes</span>
          </label>
          <label class="checkbox-label">
            <input v-model="impersonationOptions.restrictAdmin" type="checkbox" />
            <span>Restrict admin actions</span>
          </label>
        </div>

        <div class="reason-input">
          <label>Reason for impersonation (required)</label>
          <textarea
            v-model="impersonationReason"
            placeholder="Enter the reason for impersonating this user..."
            rows="3"
          ></textarea>
        </div>
      </div>
    </div>

    <template #footer>
      <WorkOSButton variant="secondary" @click="$emit('close')">Cancel</WorkOSButton>
      <WorkOSButton
        variant="primary"
        :disabled="!canImpersonate"
        @click="startImpersonation"
      >
        Start Impersonation
      </WorkOSButton>
    </template>
  </WorkOSModal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import WorkOSModal from "./base/WorkOSModal.vue"
import WorkOSButton from "./base/WorkOSButton.vue"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  organization: string
  status: "active" | "inactive" | "suspended"
  lastLogin: Date
}

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  impersonate: [user: User, options: typeof impersonationOptions.value]
}>()

const searchQuery = ref("")
const loading = ref(false)
const selectedUser = ref<User | null>(null)
const impersonationReason = ref("")

const impersonationOptions = ref({
  notifyUser: true,
  timeout: true,
  restrictAdmin: true,
})

const users = ref<User[]>([
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    organization: "Acme Corp",
    status: "active",
    lastLogin: new Date(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Manager",
    organization: "Acme Corp",
    status: "active",
    lastLogin: new Date(Date.now() - 86400000),
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob.wilson@example.com",
    role: "Editor",
    organization: "Tech Inc",
    status: "inactive",
    lastLogin: new Date(Date.now() - 604800000),
  },
  {
    id: "4",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Viewer",
    organization: "Tech Inc",
    status: "active",
    lastLogin: new Date(Date.now() - 3600000),
  },
])

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value.slice(0, 5)
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(
    user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  )
})

const canImpersonate = computed(() => {
  return selectedUser.value && impersonationReason.value.trim().length >= 10
})

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const formatLastLogin = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (hours < 1) return "Just now"
  if (hours < 24) return `${hours} hours ago`
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}

const searchUsers = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
}

const selectUser = (user: User) => {
  selectedUser.value = user
}

const startImpersonation = () => {
  if (selectedUser.value && canImpersonate.value) {
    emit("impersonate", selectedUser.value, impersonationOptions.value)
  }
}
</script>

<style scoped>
.impersonation-modal {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.warning-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef3c7;
  border-radius: 6px;
}

.warning-icon {
  font-size: 1.25rem;
}

.warning-banner p {
  margin: 0;
  color: #92400e;
  font-size: 0.875rem;
}

.user-search input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.users-list {
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-item:hover {
  background: #f9fafb;
}

.user-item.selected {
  background: #eff6ff;
  border-left: 3px solid #2563eb;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
}

.user-info {
  flex: 1;
}

.user-info h4 {
  margin: 0;
  color: #1f2937;
  font-size: 0.875rem;
}

.user-info p {
  margin: 0.125rem 0 0 0;
  color: #6b7280;
  font-size: 0.75rem;
}

.user-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.role-badge,
.org-badge {
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.625rem;
}

.role-badge {
  background: #dbeafe;
  color: #1e40af;
}

.org-badge {
  background: #f3f4f6;
  color: #374151;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.active {
  background: #10b981;
}

.status-dot.inactive {
  background: #9ca3af;
}

.status-dot.suspended {
  background: #ef4444;
}

.selected-user-panel {
  background: #f9fafb;
  border-radius: 6px;
  padding: 1rem;
}

.selected-user-panel h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.selected-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  gap: 0.5rem;
}

.info-row .label {
  color: #6b7280;
  font-size: 0.75rem;
}

.info-row .value {
  color: #1f2937;
  font-size: 0.75rem;
  font-weight: 500;
}

.impersonation-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
}

.reason-input label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.reason-input textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  resize: vertical;
  font-size: 0.875rem;
}

.reason-input textarea:focus {
  outline: none;
  border-color: #2563eb;
}
</style>
