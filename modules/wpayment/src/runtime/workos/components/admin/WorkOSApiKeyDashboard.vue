<template>
  <div class="api-key-dashboard">
    <div class="dashboard-header">
      <h2>API Keys</h2>
      <WorkOSButton variant="primary" @click="showCreateModal = true">
        Create New Key
      </WorkOSButton>
    </div>

    <div class="key-stats">
      <div class="stat-card">
        <span class="stat-value">{{ apiKeys.length }}</span>
        <span class="stat-label">Total Keys</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ activeKeys }}</span>
        <span class="stat-label">Active</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ expiredKeys }}</span>
        <span class="stat-label">Expired</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ formatNumber(totalRequests) }}</span>
        <span class="stat-label">Total Requests</span>
      </div>
    </div>

    <div class="keys-table">
      <div class="table-header">
        <div class="col-name">Name</div>
        <div class="col-key">Key</div>
        <div class="col-permissions">Permissions</div>
        <div class="col-usage">Usage</div>
        <div class="col-expires">Expires</div>
        <div class="col-status">Status</div>
        <div class="col-actions">Actions</div>
      </div>

      <div
        v-for="key in apiKeys"
        :key="key.id"
        class="table-row"
      >
        <div class="col-name">
          <div class="key-name">
            <span class="key-icon">🔑</span>
            <div>
              <h4>{{ key.name }}</h4>
              <p>{{ key.description }}</p>
            </div>
          </div>
        </div>
        <div class="col-key">
          <code class="key-preview">{{ maskKey(key.key) }}</code>
          <button class="copy-btn" @click="copyKey(key.key)">📋</button>
        </div>
        <div class="col-permissions">
          <div class="permission-tags">
            <span
              v-for="perm in key.permissions.slice(0, 2)"
              :key="perm"
              class="perm-tag"
            >
              {{ perm }}
            </span>
            <span v-if="key.permissions.length > 2" class="perm-tag more">
              +{{ key.permissions.length - 2 }}
            </span>
          </div>
        </div>
        <div class="col-usage">
          <div class="usage-bar">
            <div
              class="usage-fill"
              :style="{ width: `${(key.usage / key.limit) * 100}%` }"
            ></div>
          </div>
          <span class="usage-text">{{ formatNumber(key.usage) }} / {{ formatNumber(key.limit) }}</span>
        </div>
        <div class="col-expires">
          <span :class="['expires', { warning: isExpiringSoon(key.expiresAt) }]">
            {{ formatDate(key.expiresAt) }}
          </span>
        </div>
        <div class="col-status">
          <span :class="['status-badge', key.status]">{{ key.status }}</span>
        </div>
        <div class="col-actions">
          <button class="action-btn" title="Edit" @click="editKey(key)">✏️</button>
          <button class="action-btn" title="Regenerate" @click="regenerateKey(key.id)">🔄</button>
          <button class="action-btn danger" title="Revoke" @click="revokeKey(key.id)">🗑️</button>
        </div>
      </div>
    </div>

    <div class="usage-chart">
      <h3>API Usage (Last 7 Days)</h3>
      <div class="chart-container">
        <div class="chart-bars">
          <div
            v-for="(day, index) in usageData"
            :key="index"
            class="chart-bar"
          >
            <div class="bar" :style="{ height: `${(day.requests / maxRequests) * 100}%` }"></div>
            <span class="day-label">{{ day.day }}</span>
          </div>
        </div>
      </div>
    </div>

    <WorkOSModal
      :show="showCreateModal"
      :title="editingKey ? 'Edit API Key' : 'Create API Key'"
      large
      @close="closeCreateModal"
    >
      <div class="create-key-form">
        <div class="form-group">
          <label>Key Name *</label>
          <input v-model="keyForm.name" type="text" placeholder="e.g., Production API Key" />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="keyForm.description" placeholder="Describe the purpose of this key"></textarea>
        </div>
        <div class="form-group">
          <label>Permissions</label>
          <div class="permission-checkboxes">
            <label v-for="perm in availablePermissions" :key="perm.value" class="checkbox-label">
              <input v-model="keyForm.permissions" type="checkbox" :value="perm.value" />
              <span>{{ perm.label }}</span>
            </label>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Rate Limit (requests/hour)</label>
            <input v-model.number="keyForm.rateLimit" type="number" />
          </div>
          <div class="form-group">
            <label>Expiration</label>
            <select v-model="keyForm.expiration">
              <option value="30d">30 days</option>
              <option value="90d">90 days</option>
              <option value="1y">1 year</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
      </div>
      <template #footer>
        <WorkOSButton variant="secondary" @click="closeCreateModal">Cancel</WorkOSButton>
        <WorkOSButton variant="primary" @click="saveKey">Save</WorkOSButton>
      </template>
    </WorkOSModal>

    <WorkOSModal
      :show="showKeyModal"
      title="API Key Created"
      @close="showKeyModal = false"
    >
      <div class="key-created-modal">
        <div class="warning-banner">
          <span>⚠️</span>
          <p>Copy this key now. You won't be able to see it again!</p>
        </div>
        <div class="new-key-display">
          <code>{{ newKey }}</code>
          <WorkOSButton variant="secondary" sm @click="copyKey(newKey)">Copy</WorkOSButton>
        </div>
      </div>
    </WorkOSModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import WorkOSButton from "./base/WorkOSButton.vue"
import WorkOSModal from "./base/WorkOSModal.vue"

interface ApiKey {
  id: string
  name: string
  description: string
  key: string
  permissions: string[]
  usage: number
  limit: number
  status: "active" | "expired" | "revoked"
  expiresAt: Date
  createdAt: Date
}

interface UsageDay {
  day: string
  requests: number
}

const showCreateModal = ref(false)
const showKeyModal = ref(false)
const editingKey = ref<ApiKey | null>(null)
const newKey = ref("")

const keyForm = ref({
  name: "",
  description: "",
  permissions: [] as string[],
  rateLimit: 1000,
  expiration: "90d",
})

const availablePermissions = [
  { value: "users.read", label: "Read Users" },
  { value: "users.write", label: "Write Users" },
  { value: "organizations.read", label: "Read Organizations" },
  { value: "organizations.write", label: "Write Organizations" },
  { value: "audit.read", label: "Read Audit Logs" },
  { value: "webhooks.manage", label: "Manage Webhooks" },
]

const apiKeys = ref<ApiKey[]>([
  {
    id: "1",
    name: "Production API",
    description: "Main production API key",
    key: "sk_live_abc123def456ghi789jkl",
    permissions: ["users.read", "users.write", "organizations.read", "audit.read"],
    usage: 45678,
    limit: 100000,
    status: "active",
    expiresAt: new Date(Date.now() + 7776000000),
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Development",
    description: "Development environment key",
    key: "sk_test_xyz789abc123def456ghi",
    permissions: ["users.read", "organizations.read"],
    usage: 1234,
    limit: 10000,
    status: "active",
    expiresAt: new Date(Date.now() + 2592000000),
    createdAt: new Date("2024-06-01"),
  },
  {
    id: "3",
    name: "Legacy Integration",
    description: "Old integration - to be deprecated",
    key: "sk_live_old123key456legacy789",
    permissions: ["users.read"],
    usage: 999,
    limit: 1000,
    status: "expired",
    expiresAt: new Date(Date.now() - 86400000),
    createdAt: new Date("2023-01-01"),
  },
])

const usageData = ref<UsageDay[]>([
  { day: "Mon", requests: 12500 },
  { day: "Tue", requests: 15800 },
  { day: "Wed", requests: 18200 },
  { day: "Thu", requests: 14100 },
  { day: "Fri", requests: 16700 },
  { day: "Sat", requests: 8900 },
  { day: "Sun", requests: 7200 },
])

const activeKeys = computed(() => apiKeys.value.filter(k => k.status === "active").length)
const expiredKeys = computed(() => apiKeys.value.filter(k => k.status === "expired").length)
const totalRequests = computed(() => apiKeys.value.reduce((sum, k) => sum + k.usage, 0))
const maxRequests = computed(() => Math.max(...usageData.value.map(d => d.requests)))

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

const maskKey = (key: string) => {
  return `${key.slice(0, 12)}...${key.slice(-4)}`
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const isExpiringSoon = (date: Date) => {
  const daysUntilExpiry = (date.getTime() - Date.now()) / 86400000
  return daysUntilExpiry > 0 && daysUntilExpiry < 30
}

const copyKey = async (key: string) => {
  await navigator.clipboard.writeText(key)
}

const editKey = (key: ApiKey) => {
  editingKey.value = key
  keyForm.value = {
    name: key.name,
    description: key.description,
    permissions: [...key.permissions],
    rateLimit: key.limit / 24,
    expiration: "90d",
  }
  showCreateModal.value = true
}

const regenerateKey = (id: string) => {
  const key = apiKeys.value.find(k => k.id === id)
  if (key) {
    key.key = `sk_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
    newKey.value = key.key
    showKeyModal.value = true
  }
}

const revokeKey = (id: string) => {
  const key = apiKeys.value.find(k => k.id === id)
  if (key) {
    key.status = "revoked"
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingKey.value = null
  keyForm.value = {
    name: "",
    description: "",
    permissions: [],
    rateLimit: 1000,
    expiration: "90d",
  }
}

const saveKey = () => {
  if (editingKey.value) {
    Object.assign(editingKey.value, {
      name: keyForm.value.name,
      description: keyForm.value.description,
      permissions: keyForm.value.permissions,
    })
  } else {
    newKey.value = `sk_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
    apiKeys.value.push({
      id: Date.now().toString(),
      name: keyForm.value.name,
      description: keyForm.value.description,
      key: newKey.value,
      permissions: keyForm.value.permissions,
      usage: 0,
      limit: keyForm.value.rateLimit * 24,
      status: "active",
      expiresAt: new Date(Date.now() + 7776000000),
      createdAt: new Date(),
    })
    showKeyModal.value = true
  }
  closeCreateModal()
}
</script>

<style scoped>
.api-key-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.dashboard-header h2 {
  margin: 0;
  color: #1f2937;
}

.key-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.keys-table {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.table-header {
  display: flex;
  background: #f9fafb;
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
}

.table-row {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #f3f4f6;
  align-items: center;
}

.col-name { width: 200px; }
.col-key { width: 180px; }
.col-permissions { width: 150px; }
.col-usage { width: 150px; }
.col-expires { width: 120px; }
.col-status { width: 80px; }
.col-actions { width: 100px; }

.key-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.key-icon {
  font-size: 1.25rem;
}

.key-name h4 {
  margin: 0;
  color: #1f2937;
  font-size: 0.875rem;
}

.key-name p {
  margin: 0.125rem 0 0 0;
  color: #6b7280;
  font-size: 0.75rem;
}

.key-preview {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: monospace;
}

.copy-btn {
  border: none;
  background: none;
  cursor: pointer;
  margin-left: 0.5rem;
}

.permission-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.perm-tag {
  padding: 0.125rem 0.5rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 9999px;
  font-size: 0.625rem;
}

.perm-tag.more {
  background: #f3f4f6;
  color: #6b7280;
}

.usage-bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.usage-fill {
  height: 100%;
  background: #10b981;
  border-radius: 3px;
}

.usage-text {
  font-size: 0.625rem;
  color: #6b7280;
}

.expires {
  font-size: 0.75rem;
  color: #374151;
}

.expires.warning {
  color: #dc2626;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 500;
}

.status-badge.active {
  background: #d1fae5;
  color: #059669;
}

.status-badge.expired {
  background: #fee2e2;
  color: #dc2626;
}

.status-badge.revoked {
  background: #f3f4f6;
  color: #6b7280;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #f3f4f6;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.25rem;
}

.action-btn.danger:hover {
  background: #fee2e2;
}

.usage-chart {
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.usage-chart h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.chart-container {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 150px;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar {
  width: 30px;
  background: linear-gradient(180deg, #2563eb, #3b82f6);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
}

.day-label {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.create-key-form {
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
  color: #374151;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.permission-checkboxes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.key-created-modal {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.warning-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef3c7;
  border-radius: 6px;
}

.warning-banner p {
  margin: 0;
  color: #92400e;
  font-size: 0.875rem;
}

.new-key-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 6px;
}

.new-key-display code {
  flex: 1;
  font-family: monospace;
  font-size: 0.875rem;
  word-break: break-all;
}
</style>
