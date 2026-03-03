<script setup lang="ts">
import type { Connection } from "./types"

const props = defineProps<{
  connection: Connection
}>()

const emit = defineEmits<{
  test: [connection: Connection]
  viewLogs: [connection: Connection]
  edit: [connection: Connection]
}>()

const { formatTime, getProviderIcon, getCheckIcon, getAlertIcon } = useSSOFormatters()
</script>

<template>
  <div class="connection-card">
    <div class="connection-header">
      <div class="provider-info">
        <div class="provider-icon">{{ getProviderIcon(connection.provider) }}</div>
        <div class="provider-details">
          <h4>{{ connection.name }}</h4>
          <p>{{ connection.provider }} • {{ connection.domain }}</p>
        </div>
      </div>
      <div class="connection-status">
        <span :class="['status-badge', connection.status]">
          {{ connection.status }}
        </span>
        <span class="last-check">Last check: {{ formatTime(connection.lastCheck) }}</span>
      </div>
    </div>

    <div class="health-metrics">
      <div class="metric">
        <div class="metric-header">
          <span class="metric-label">Uptime</span>
          <span class="metric-value">{{ connection.uptime }}%</span>
        </div>
        <div class="metric-bar">
          <div
            class="metric-fill uptime"
            :style="{ width: `${connection.uptime}%` }"
          ></div>
        </div>
      </div>

      <div class="metric">
        <div class="metric-header">
          <span class="metric-label">Response Time</span>
          <span class="metric-value">{{ connection.responseTime }}ms</span>
        </div>
        <div class="metric-bar">
          <div
            class="metric-fill response"
            :style="{ width: `${Math.min(connection.responseTime / 10, 100)}%` }"
          ></div>
        </div>
      </div>

      <div class="metric">
        <div class="metric-header">
          <span class="metric-label">Success Rate</span>
          <span class="metric-value">{{ connection.successRate }}%</span>
        </div>
        <div class="metric-bar">
          <div
            class="metric-fill success"
            :style="{ width: `${connection.successRate}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div class="check-results">
      <h5>Health Checks</h5>
      <div class="checks-grid">
        <div
          v-for="check in connection.checks"
          :key="check.name"
          :class="['check-item', check.status]"
        >
          <span class="check-icon">{{ getCheckIcon(check.status) }}</span>
          <span class="check-name">{{ check.name }}</span>
          <span class="check-value">{{ check.value }}</span>
        </div>
      </div>
    </div>

    <div class="connection-actions">
      <WorkOSButton variant="secondary" sm @click="emit('test', connection)">
        Test Connection
      </WorkOSButton>
      <WorkOSButton variant="secondary" sm @click="emit('viewLogs', connection)">
        View Logs
      </WorkOSButton>
      <WorkOSButton variant="secondary" sm @click="emit('edit', connection)">
        Configure
      </WorkOSButton>
    </div>

    <div v-if="connection.alerts.length > 0" class="connection-alerts">
      <div
        v-for="alert in connection.alerts"
        :key="alert.id"
        :class="['alert-item', alert.severity]"
      >
        <span class="alert-icon">{{ getAlertIcon(alert.severity) }}</span>
        <span class="alert-message">{{ alert.message }}</span>
        <span class="alert-time">{{ formatTime(alert.timestamp) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.connection-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.connection-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.provider-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.provider-icon {
  font-size: 2rem;
}

.provider-details h4 {
  margin: 0;
  color: #1f2937;
}

.provider-details p {
  margin: 0.125rem 0 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.connection-status {
  text-align: right;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.healthy {
  background: #d1fae5;
  color: #059669;
}

.status-badge.degraded {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.down {
  background: #fee2e2;
  color: #dc2626;
}

.last-check {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.health-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.metric {
  background: #f9fafb;
  padding: 0.75rem;
  border-radius: 6px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.metric-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
}

.metric-bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: 2px;
}

.metric-fill.uptime {
  background: #10b981;
}

.metric-fill.response {
  background: #3b82f6;
}

.metric-fill.success {
  background: #8b5cf6;
}

.check-results {
  margin-bottom: 1rem;
}

.check-results h5 {
  margin: 0 0 0.75rem 0;
  color: #374151;
  font-size: 0.875rem;
}

.checks-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 4px;
  font-size: 0.75rem;
}

.check-item.healthy {
  background: #d1fae5;
}

.check-item.warning {
  background: #fef3c7;
}

.check-item.error {
  background: #fee2e2;
}

.check-icon {
  font-weight: 700;
}

.check-item.healthy .check-icon {
  color: #059669;
}

.check-item.warning .check-icon {
  color: #d97706;
}

.check-item.error .check-icon {
  color: #dc2626;
}

.check-name {
  flex: 1;
  color: #374151;
}

.check-value {
  color: #6b7280;
}

.connection-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.connection-alerts {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.alert-item.warning {
  background: #fef3c7;
}

.alert-item.error {
  background: #fee2e2;
}

.alert-message {
  flex: 1;
  font-size: 0.875rem;
  color: #374151;
}

.alert-time {
  font-size: 0.75rem;
  color: #6b7280;
}
</style>
