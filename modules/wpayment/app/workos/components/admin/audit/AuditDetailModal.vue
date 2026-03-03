<script setup lang="ts">
import type { AuditLog } from "../../../composables/useAuditLogs"

const props = defineProps<{
  show: boolean
  log: AuditLog | null
  formatDateTime: (timestamp: string) => string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <WorkOSModal :show="show" title="Log Details" @close="emit('close')">
    <div v-if="log" class="log-detail">
      <div class="detail-grid">
        <div class="detail-item">
          <label>Timestamp</label>
          <span>{{ formatDateTime(log.timestamp) }}</span>
        </div>
        <div class="detail-item">
          <label>User</label>
          <span>{{ log.userName || log.userId }}</span>
        </div>
        <div class="detail-item">
          <label>Email</label>
          <span>{{ log.userEmail || '-' }}</span>
        </div>
        <div class="detail-item">
          <label>Action</label>
          <span>{{ log.action }}</span>
        </div>
        <div class="detail-item">
          <label>Resource</label>
          <span>{{ log.resource }}</span>
        </div>
        <div class="detail-item">
          <label>Severity</label>
          <span class="severity-badge" :class="log.severity">{{ log.severity }}</span>
        </div>
        <div class="detail-item">
          <label>Status</label>
          <span :class="log.success ? 'text-green' : 'text-red'">
            {{ log.success ? 'Success' : 'Failed' }}
          </span>
        </div>
        <div class="detail-item">
          <label>IP Address</label>
          <span>{{ log.ipAddress || '-' }}</span>
        </div>
        <div class="detail-item">
          <label>User Agent</label>
          <span class="user-agent">{{ log.userAgent || '-' }}</span>
        </div>
        <div class="detail-item">
          <label>Organization</label>
          <span>{{ log.organizationName || log.organizationId || '-' }}</span>
        </div>
      </div>

      <div v-if="log.metadata" class="metadata-section">
        <h4>Additional Data</h4>
        <pre class="metadata-json">{{ JSON.stringify(log.metadata, null, 2) }}</pre>
      </div>
    </div>
  </WorkOSModal>
</template>

<style scoped>
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

.text-green { color: #059669; }
.text-red { color: #dc2626; }

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
  border-radius: 6px;
  font-size: 0.75rem;
  overflow-x: auto;
}
</style>
