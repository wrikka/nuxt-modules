<template>
  <div class="audit-log-viewer">
    <!-- Header -->
    <div class="viewer-header">
      <h2>Audit Logs</h2>
      <div class="header-actions">
        <WorkOSButton variant="secondary" @click="exportLogs">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </template>
          Export
        </WorkOSButton>
        <WorkOSButton variant="secondary" @click="refreshLogs">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </template>
          Refresh
        </WorkOSButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>Date Range</label>
          <div class="date-inputs">
            <input v-model="filters.startDate" type="date" class="date-input" />
            <span>to</span>
            <input v-model="filters.endDate" type="date" class="date-input" />
          </div>
        </div>

        <div class="filter-group">
          <label>User</label>
          <input v-model="filters.user" type="text" placeholder="Search by user..." class="text-input" />
        </div>

        <div class="filter-group">
          <label>Action</label>
          <select v-model="filters.action" class="select-input">
            <option value="">All Actions</option>
            <option value="user.login">User Login</option>
            <option value="user.logout">User Logout</option>
            <option value="user.create">User Created</option>
            <option value="user.update">User Updated</option>
            <option value="user.delete">User Deleted</option>
            <option value="org.create">Organization Created</option>
            <option value="org.update">Organization Updated</option>
            <option value="role.assign">Role Assigned</option>
            <option value="role.remove">Role Removed</option>
            <option value="permission.grant">Permission Granted</option>
            <option value="permission.revoke">Permission Revoked</option>
            <option value="sso.connect">SSO Connected</option>
            <option value="sso.disconnect">SSO Disconnected</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Severity</label>
          <select v-model="filters.severity" class="select-input">
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Status</label>
          <select v-model="filters.success" class="select-input">
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div class="filter-actions">
        <WorkOSButton variant="secondary" size="sm" @click="clearFilters">Clear Filters</WorkOSButton>
      </div>
    </div>

    <!-- Logs Table -->
    <div class="logs-table-container">
      <table class="logs-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Resource</th>
            <th>Severity</th>
            <th>Status</th>
            <th>IP Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="loading-cell">
              <div class="loading-spinner"></div>
              Loading audit logs...
            </td>
          </tr>
          <tr v-else-if="logs.length === 0">
            <td colspan="8" class="empty-cell">No audit logs found</td>
          </tr>
          <tr v-else v-for="log in logs" :key="log.id" class="log-row" @click="showLogDetail(log)">
            <td class="timestamp-cell">
              <span class="date">{{ formatDate(log.timestamp) }}</span>
              <span class="time">{{ formatTime(log.timestamp) }}</span>
            </td>
            <td class="user-cell">
              <div class="user-info">
                <span class="user-name">{{ log.userName || log.userId }}</span>
                <span v-if="log.userEmail" class="user-email">{{ log.userEmail }}</span>
              </div>
            </td>
            <td class="action-cell">
              <span class="action-badge" :class="getActionClass(log.action)">
                {{ formatAction(log.action) }}
              </span>
            </td>
            <td class="resource-cell">{{ log.resource }}</td>
            <td class="severity-cell">
              <span class="severity-badge" :class="log.severity">{{ log.severity }}</span>
            </td>
            <td class="status-cell">
              <span class="status-indicator" :class="log.success ? 'success' : 'failed'">
                {{ log.success ? "✓" : "✗" }}
              </span>
            </td>
            <td class="ip-cell">{{ log.ipAddress || "-" }}</td>
            <td class="actions-cell">
              <button class="detail-btn" @click.stop="showLogDetail(log)">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <span class="pagination-info">Showing {{ pagination.from }}-{{ pagination.to }} of {{ pagination.total }} logs</span>
      <div class="pagination-controls">
        <button class="page-btn" :disabled="!pagination.hasPrev" @click="prevPage">Previous</button>
        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            class="page-num"
            :class="{ active: page === pagination.current }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
        <button class="page-btn" :disabled="!pagination.hasNext" @click="nextPage">Next</button>
      </div>
    </div>

    <!-- Log Detail Modal -->
    <WorkOSModal :show="showDetailModal" title="Log Details" size="lg" @close="showDetailModal = false">
      <div v-if="selectedLog" class="log-detail">
        <div class="detail-grid">
          <div class="detail-item">
            <label>Timestamp</label>
            <span>{{ formatDateTime(selectedLog.timestamp) }}</span>
          </div>
          <div class="detail-item">
            <label>User</label>
            <span>{{ selectedLog.userName || selectedLog.userId }}</span>
          </div>
          <div class="detail-item">
            <label>Email</label>
            <span>{{ selectedLog.userEmail || "-" }}</span>
          </div>
          <div class="detail-item">
            <label>Action</label>
            <span>{{ selectedLog.action }}</span>
          </div>
          <div class="detail-item">
            <label>Resource</label>
            <span>{{ selectedLog.resource }}</span>
          </div>
          <div class="detail-item">
            <label>Severity</label>
            <span class="severity-badge" :class="selectedLog.severity">{{ selectedLog.severity }}</span>
          </div>
          <div class="detail-item">
            <label>Status</label>
            <span :class="selectedLog.success ? 'text-green' : 'text-red'">
              {{ selectedLog.success ? "Success" : "Failed" }}
            </span>
          </div>
          <div class="detail-item">
            <label>IP Address</label>
            <span>{{ selectedLog.ipAddress || "-" }}</span>
          </div>
          <div class="detail-item">
            <label>User Agent</label>
            <span class="user-agent">{{ selectedLog.userAgent || "-" }}</span>
          </div>
          <div class="detail-item">
            <label>Organization</label>
            <span>{{ selectedLog.organizationName || selectedLog.organizationId || "-" }}</span>
          </div>
        </div>

        <div v-if="selectedLog.metadata" class="metadata-section">
          <h4>Additional Data</h4>
          <pre class="metadata-json">{{ JSON.stringify(selectedLog.metadata, null, 2) }}</pre>
        </div>
      </div>
    </WorkOSModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import WorkOSButton from "./base/WorkOSButton.vue"
import WorkOSModal from "./base/WorkOSModal.vue"
import { useWorkOSAudit } from "../composables"

interface Props {
  organizationId?: string
}

const props = defineProps<Props>()

const { getAuditLogs, exportAuditLogs } = useWorkOSAudit()

const loading = ref(false)
const logs = ref<any[]>([])
const showDetailModal = ref(false)
const selectedLog = ref<any>(null)

const filters = ref<{
  startDate: string
  endDate: string
  user: string
  action: string
  severity: "low" | "medium" | "high" | "critical" | ""
  success: string
}>({
  startDate: "",
  endDate: "",
  user: "",
  action: "",
  severity: "",
  success: "",
})

const pagination = ref({
  current: 1,
  total: 0,
  from: 0,
  to: 0,
  hasPrev: false,
  hasNext: false,
  perPage: 20,
})

const visiblePages = computed(() => {
  const total = Math.ceil(pagination.value.total / pagination.value.perPage)
  const current = pagination.value.current
  const pages: number[] = []

  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString()
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString()
}

const formatDateTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString()
}

const formatAction = (action: string) => {
  return action.split(".").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(": ")
}

const getActionClass = (action: string) => {
  const [category] = action.split(".")
  return `action-${category}`
}

const showLogDetail = (log: any) => {
  selectedLog.value = log
  showDetailModal.value = true
}

const refreshLogs = async () => {
  loading.value = true
  try {
    const result = await getAuditLogs({
      organizationId: props.organizationId,
      startDate: filters.value.startDate || undefined,
      endDate: filters.value.endDate || undefined,
      userId: filters.value.user || undefined,
      action: filters.value.action || undefined,
      severity: filters.value.severity || undefined,
      success: filters.value.success === "" ? undefined : filters.value.success === "success",
      limit: pagination.value.perPage,
      offset: (pagination.value.current - 1) * pagination.value.perPage,
    })
    logs.value = result.logs
    pagination.value = {
      ...pagination.value,
      total: result.totalCount,
      from: (pagination.value.current - 1) * pagination.value.perPage + 1,
      to: Math.min(pagination.value.current * pagination.value.perPage, result.totalCount),
      hasPrev: pagination.value.current > 1,
      hasNext: pagination.value.current * pagination.value.perPage < result.totalCount,
    }
  } finally {
    loading.value = false
  }
}

const exportLogs = async () => {
  const result = await exportAuditLogs({
    organizationId: props.organizationId,
    startDate: filters.value.startDate || undefined,
    endDate: filters.value.endDate || undefined,
    userId: filters.value.user || undefined,
    action: filters.value.action || undefined,
    severity: filters.value.severity || undefined,
    success: filters.value.success === "" ? undefined : filters.value.success === "success",
    format: "csv",
  })
  const csvContent = typeof result === "string" ? result : JSON.stringify(result)
  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const clearFilters = () => {
  filters.value = {
    startDate: "",
    endDate: "",
    user: "",
    action: "",
    severity: "",
    success: "",
  }
  pagination.value.current = 1
  refreshLogs()
}

const prevPage = () => {
  if (pagination.value.hasPrev) {
    pagination.value.current--
    refreshLogs()
  }
}

const nextPage = () => {
  if (pagination.value.hasNext) {
    pagination.value.current++
    refreshLogs()
  }
}

const goToPage = (page: number) => {
  pagination.value.current = page
  refreshLogs()
}

onMounted(() => {
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  filters.value.startDate = thirtyDaysAgo.toISOString().split("T")[0] ?? ""
  filters.value.endDate = today.toISOString().split("T")[0] ?? ""
  refreshLogs()
})
</script>

<style scoped>
.audit-log-viewer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.viewer-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #111827;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.filters-section {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
}

.filter-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-group label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-input,
.text-input,
.select-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.filter-actions {
  margin-top: 0.75rem;
  text-align: right;
}

.logs-table-container {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
}

.logs-table th {
  background: #f9fafb;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
}

.logs-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
}

.log-row {
  cursor: pointer;
  transition: background 0.15s;
}

.log-row:hover {
  background: #f9fafb;
}

.loading-cell,
.empty-cell {
  text-align: center;
  padding: 3rem !important;
  color: #6b7280;
}

.loading-spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.timestamp-cell {
  white-space: nowrap;
}

.timestamp-cell .date {
  display: block;
  color: #111827;
}

.timestamp-cell .time {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  color: #111827;
}

.user-email {
  font-size: 0.75rem;
  color: #6b7280;
}

.action-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.action-user {
  background: #dbeafe;
  color: #1e40af;
}

.action-org {
  background: #d1fae5;
  color: #065f46;
}

.action-role {
  background: #fef3c7;
  color: #92400e;
}

.action-permission {
  background: #ede9fe;
  color: #5b21b6;
}

.action-sso {
  background: #fce7f3;
  color: #9d174d;
}

.severity-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
}

.severity-badge.low {
  background: #e5e7eb;
  color: #374151;
}

.severity-badge.medium {
  background: #fef3c7;
  color: #92400e;
}

.severity-badge.high {
  background: #fee2e2;
  color: #991b1b;
}

.severity-badge.critical {
  background: #dc2626;
  color: white;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.75rem;
}

.status-indicator.success {
  background: #d1fae5;
  color: #065f46;
}

.status-indicator.failed {
  background: #fee2e2;
  color: #991b1b;
}

.detail-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background: white;
  color: #374151;
  font-size: 0.75rem;
  cursor: pointer;
}

.detail-btn:hover {
  background: #f9fafb;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.page-btn:hover:not(:disabled) {
  background: #f9fafb;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-num {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.page-num:hover {
  background: #f9fafb;
}

.page-num.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.log-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

.detail-item span {
  font-size: 0.875rem;
  color: #111827;
}

.text-green {
  color: #059669;
}

.text-red {
  color: #dc2626;
}

.user-agent {
  font-size: 0.75rem !important;
  word-break: break-all;
}

.metadata-section h4 {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.metadata-json {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  overflow-x: auto;
}
</style>
