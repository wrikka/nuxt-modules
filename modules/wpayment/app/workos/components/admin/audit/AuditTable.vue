<script setup lang="ts">
import type { AuditLog } from "../../../composables/useAuditLogs"

const props = defineProps<{
  logs: AuditLog[]
  loading: boolean
  formatDate: (timestamp: string) => string
  formatTime: (timestamp: string) => string
  formatAction: (action: string) => string
  getActionClass: (action: string) => string
}>()

const emit = defineEmits<{
  view: [log: AuditLog]
}>()
</script>

<template>
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
        <tr v-else v-for="log in logs" :key="log.id" class="log-row" @click="emit('view', log)">
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
              {{ log.success ? '✓' : '✗' }}
            </span>
          </td>
          <td class="ip-cell">{{ log.ipAddress || '-' }}</td>
          <td class="actions-cell">
            <button class="detail-btn" @click.stop="emit('view', log)">View</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.logs-table-container {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
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
  to { transform: rotate(360deg); }
}

.timestamp-cell { white-space: nowrap; }
.timestamp-cell .date { display: block; color: #111827; }
.timestamp-cell .time { display: block; font-size: 0.75rem; color: #6b7280; }

.user-info { display: flex; flex-direction: column; }
.user-name { color: #111827; }
.user-email { font-size: 0.75rem; color: #6b7280; }

.action-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.action-user { background: #dbeafe; color: #1e40af; }
.action-org { background: #d1fae5; color: #065f46; }
.action-role { background: #fef3c7; color: #92400e; }
.action-permission { background: #ede9fe; color: #5b21b6; }
.action-sso { background: #fce7f3; color: #9d174d; }

.severity-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
}

.severity-badge.low { background: #e5e7eb; color: #374151; }
.severity-badge.medium { background: #fef3c7; color: #92400e; }
.severity-badge.high { background: #fee2e2; color: #991b1b; }
.severity-badge.critical { background: #dc2626; color: white; }

.status-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.75rem;
}

.status-indicator.success { background: #d1fae5; color: #065f46; }
.status-indicator.failed { background: #fee2e2; color: #991b1b; }

.detail-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 0.75rem;
  cursor: pointer;
}

.detail-btn:hover { background: #f9fafb; }
</style>
