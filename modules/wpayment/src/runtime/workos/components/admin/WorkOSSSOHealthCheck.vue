<template>
  <div class="sso-health-check">
    <div class="health-header">
      <h2>SSO Connection Health</h2>
      <div class="header-actions">
        <WorkOSButton variant="secondary" @click="runAllChecks">Run All Checks</WorkOSButton>
        <WorkOSButton variant="primary" @click="showAddConnection = true">Add Connection</WorkOSButton>
      </div>
    </div>

    <div class="health-overview">
      <div :class="['overview-card', overallStatus]">
        <div class="status-icon">
          {{ getStatusIcon(overallStatus) }}
        </div>
        <div class="status-info">
          <h3>{{ overallStatusLabel }}</h3>
          <p>{{ connections.length }} connections configured</p>
        </div>
      </div>
    </div>

    <div class="connections-list">
      <div
        v-for="connection in connections"
        :key="connection.id"
        class="connection-card"
      >
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
          <WorkOSButton variant="secondary" sm @click="testConnection(connection)">
            Test Connection
          </WorkOSButton>
          <WorkOSButton variant="secondary" sm @click="viewLogs(connection)">
            View Logs
          </WorkOSButton>
          <WorkOSButton variant="secondary" sm @click="editConnection(connection)">
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
    </div>

    <div class="health-trends">
      <h3>Health Trends (Last 7 Days)</h3>
      <div class="trends-chart">
        <div class="chart-y-axis">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
        <div class="chart-area">
          <div
            v-for="(day, index) in healthTrend"
            :key="index"
            class="chart-column"
          >
            <div
              class="chart-bar"
              :style="{ height: `${day.health}%` }"
              :class="getHealthClass(day.health)"
            ></div>
            <span class="chart-label">{{ day.day }}</span>
          </div>
        </div>
      </div>
    </div>

    <WorkOSModal
      :show="showAddConnection"
      title="Add SSO Connection"
      large
      @close="showAddConnection = false"
    >
      <div class="add-connection-form">
        <div class="form-group">
          <label>Connection Name</label>
          <input v-model="newConnection.name" type="text" placeholder="e.g., Corporate SSO" />
        </div>
        <div class="form-group">
          <label>Provider</label>
          <select v-model="newConnection.provider">
            <option value="Okta">Okta</option>
            <option value="Azure AD">Azure AD</option>
            <option value="Google Workspace">Google Workspace</option>
            <option value="OneLogin">OneLogin</option>
            <option value="PingFederate">PingFederate</option>
          </select>
        </div>
        <div class="form-group">
          <label>Domain</label>
          <input v-model="newConnection.domain" type="text" placeholder="company.com" />
        </div>
        <div class="form-group">
          <label>Client ID</label>
          <input v-model="newConnection.clientId" type="text" placeholder="Enter client ID" />
        </div>
        <div class="form-group">
          <label>Client Secret</label>
          <input v-model="newConnection.clientSecret" type="password" placeholder="Enter client secret" />
        </div>
      </div>
      <template #footer>
        <WorkOSButton variant="secondary" @click="showAddConnection = false">Cancel</WorkOSButton>
        <WorkOSButton variant="primary" @click="saveConnection">Save Connection</WorkOSButton>
      </template>
    </WorkOSModal>

    <WorkOSModal
      :show="showTestModal"
      title="Connection Test"
      @close="showTestModal = false"
    >
      <div class="test-results">
        <div v-if="testInProgress" class="test-progress">
          <div class="spinner"></div>
          <p>Testing connection...</p>
        </div>
        <div v-else-if="testResult" class="test-complete">
          <div :class="['test-status', testResult.success ? 'success' : 'failed']">
            {{ testResult.success ? '✓ Connection Successful' : '✕ Connection Failed' }}
          </div>
          <div class="test-details">
            <div v-for="step in testResult.steps" :key="step.name" class="test-step">
              <span :class="['step-status', step.success ? 'success' : 'failed']">
                {{ step.success ? '✓' : '✕' }}
              </span>
              <span>{{ step.name }}</span>
              <span class="step-time">{{ step.duration }}ms</span>
            </div>
          </div>
        </div>
      </div>
    </WorkOSModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import WorkOSButton from "./base/WorkOSButton.vue"
import WorkOSModal from "./base/WorkOSModal.vue"

interface HealthCheck {
  name: string
  status: "healthy" | "warning" | "error"
  value: string
}

interface Alert {
  id: string
  severity: "warning" | "error"
  message: string
  timestamp: Date
}

interface Connection {
  id: string
  name: string
  provider: string
  domain: string
  status: "healthy" | "degraded" | "down"
  uptime: number
  responseTime: number
  successRate: number
  lastCheck: Date
  checks: HealthCheck[]
  alerts: Alert[]
}

interface TrendDay {
  day: string
  health: number
}

const showAddConnection = ref(false)
const showTestModal = ref(false)
const testInProgress = ref(false)
const testResult = ref<{ success: boolean; steps: { name: string; success: boolean; duration: number }[] } | null>(null)

const newConnection = ref({
  name: "",
  provider: "Okta",
  domain: "",
  clientId: "",
  clientSecret: "",
})

const connections = ref<Connection[]>([
  {
    id: "1",
    name: "Corporate SSO",
    provider: "Okta",
    domain: "acme.com",
    status: "healthy",
    uptime: 99.9,
    responseTime: 145,
    successRate: 99.8,
    lastCheck: new Date(),
    checks: [
      { name: "DNS Resolution", status: "healthy", value: "OK" },
      { name: "Certificate", status: "healthy", value: "Valid (30 days)" },
      { name: "Metadata", status: "healthy", value: "Valid" },
      { name: "Authentication", status: "healthy", value: "OK" },
    ],
    alerts: [],
  },
  {
    id: "2",
    name: "Partner Portal",
    provider: "Azure AD",
    domain: "partners.acme.com",
    status: "degraded",
    uptime: 98.5,
    responseTime: 320,
    successRate: 96.2,
    lastCheck: new Date(Date.now() - 300000),
    checks: [
      { name: "DNS Resolution", status: "healthy", value: "OK" },
      { name: "Certificate", status: "warning", value: "Expiring soon (7 days)" },
      { name: "Metadata", status: "healthy", value: "Valid" },
      { name: "Authentication", status: "warning", value: "Slow response" },
    ],
    alerts: [
      { id: "1", severity: "warning", message: "Certificate expiring in 7 days", timestamp: new Date() },
    ],
  },
  {
    id: "3",
    name: "Contractor Access",
    provider: "Google Workspace",
    domain: "contractors.acme.com",
    status: "down",
    uptime: 85.0,
    responseTime: 0,
    successRate: 0,
    lastCheck: new Date(Date.now() - 3600000),
    checks: [
      { name: "DNS Resolution", status: "error", value: "Failed" },
      { name: "Certificate", status: "error", value: "N/A" },
      { name: "Metadata", status: "error", value: "N/A" },
      { name: "Authentication", status: "error", value: "Failed" },
    ],
    alerts: [
      { id: "1", severity: "error", message: "Connection unreachable", timestamp: new Date() },
    ],
  },
])

const healthTrend = ref<TrendDay[]>([
  { day: "Mon", health: 99 },
  { day: "Tue", health: 98 },
  { day: "Wed", health: 100 },
  { day: "Thu", health: 97 },
  { day: "Fri", health: 85 },
  { day: "Sat", health: 92 },
  { day: "Sun", health: 95 },
])

const overallStatus = computed(() => {
  if (connections.value.some(c => c.status === "down")) return "down"
  if (connections.value.some(c => c.status === "degraded")) return "degraded"
  return "healthy"
})

const overallStatusLabel = computed(() => {
  const labels = {
    healthy: "All Systems Operational",
    degraded: "Some Systems Degraded",
    down: "System Outage Detected",
  }
  return labels[overallStatus.value]
})

const getStatusIcon = (status: string) => {
  const icons = { healthy: "✓", degraded: "⚠", down: "✕" }
  return icons[status as keyof typeof icons] || "?"
}

const getProviderIcon = (provider: string) => {
  const icons: Record<string, string> = {
    Okta: "🔵",
    "Azure AD": "🟦",
    "Google Workspace": "🟢",
    OneLogin: "🟠",
    PingFederate: "🟣",
  }
  return icons[provider] || "⚪"
}

const getCheckIcon = (status: string) => {
  const icons = { healthy: "✓", warning: "⚠", error: "✕" }
  return icons[status as keyof typeof icons] || "?"
}

const getAlertIcon = (severity: string) => {
  return severity === "error" ? "🚨" : "⚠️"
}

const getHealthClass = (health: number) => {
  if (health >= 95) return "excellent"
  if (health >= 80) return "good"
  if (health >= 60) return "warning"
  return "critical"
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

const runAllChecks = async () => {
  // Run all health checks
}

const testConnection = async (connection: Connection) => {
  showTestModal.value = true
  testInProgress.value = true

  setTimeout(() => {
    testInProgress.value = false
    testResult.value = {
      success: connection.status !== "down",
      steps: [
        { name: "DNS Resolution", success: true, duration: 45 },
        { name: "Certificate Validation", success: true, duration: 120 },
        { name: "Metadata Fetch", success: true, duration: 85 },
        { name: "Authentication Test", success: connection.status !== "down", duration: 200 },
      ],
    }
  }, 2000)
}

const viewLogs = (connection: Connection) => {
  // View logs
}

const editConnection = (connection: Connection) => {
  // Edit connection
}

const saveConnection = () => {
  showAddConnection.value = false
}
</script>

<style scoped>
.sso-health-check {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.health-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.health-header h2 {
  margin: 0;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.health-overview {
  margin-bottom: 2rem;
}

.overview-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 8px;
}

.overview-card.healthy {
  background: #d1fae5;
  border: 1px solid #10b981;
}

.overview-card.degraded {
  background: #fef3c7;
  border: 1px solid #f59e0b;
}

.overview-card.down {
  background: #fee2e2;
  border: 1px solid #dc2626;
}

.status-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.overview-card.healthy .status-icon {
  background: #10b981;
  color: white;
}

.overview-card.degraded .status-icon {
  background: #f59e0b;
  color: white;
}

.overview-card.down .status-icon {
  background: #dc2626;
  color: white;
}

.status-info h3 {
  margin: 0;
  color: #1f2937;
}

.status-info p {
  margin: 0.25rem 0 0 0;
  color: #6b7280;
}

.connections-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

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

.health-trends {
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.health-trends h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.trends-chart {
  display: flex;
  gap: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #9ca3af;
  padding: 0.5rem 0;
}

.chart-area {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
  height: 150px;
}

.chart-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.chart-bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  margin-top: auto;
}

.chart-bar.excellent {
  background: #10b981;
}

.chart-bar.good {
  background: #3b82f6;
}

.chart-bar.warning {
  background: #f59e0b;
}

.chart-bar.critical {
  background: #dc2626;
}

.chart-label {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.add-connection-form {
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
.form-group select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.test-results {
  min-height: 200px;
}

.test-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.test-complete {
  text-align: center;
}

.test-status {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
}

.test-status.success {
  background: #d1fae5;
  color: #059669;
}

.test-status.failed {
  background: #fee2e2;
  color: #dc2626;
}

.test-details {
  text-align: left;
}

.test-step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.step-status {
  font-weight: 700;
}

.step-status.success {
  color: #059669;
}

.step-status.failed {
  color: #dc2626;
}

.step-time {
  margin-left: auto;
  color: #9ca3af;
  font-size: 0.75rem;
}
</style>
