<template>
  <div class="security-dashboard">
    <div class="dashboard-header">
      <h2>Security Incidents</h2>
      <div class="header-actions">
        <select v-model="timeRange" class="time-select">
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <WorkOSButton variant="secondary" @click="exportReport">Export Report</WorkOSButton>
      </div>
    </div>

    <div class="security-stats">
      <div class="stat-card critical">
        <div class="stat-icon">🚨</div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.criticalIncidents }}</span>
          <span class="stat-label">Critical Incidents</span>
        </div>
      </div>
      <div class="stat-card warning">
        <div class="stat-icon">⚠️</div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.warningIncidents }}</span>
          <span class="stat-label">Warnings</span>
        </div>
      </div>
      <div class="stat-card blocked">
        <div class="stat-icon">🛡️</div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.blockedAttempts }}</span>
          <span class="stat-label">Blocked Attempts</span>
        </div>
      </div>
      <div class="stat-card resolved">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.resolvedIncidents }}</span>
          <span class="stat-label">Resolved</span>
        </div>
      </div>
    </div>

    <div class="incident-filters">
      <div class="filter-tabs">
        <button
          v-for="filter in filters"
          :key="filter.value"
          :class="['filter-tab', { active: activeFilter === filter.value }]"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
          <span class="filter-count">{{ filter.count }}</span>
        </button>
      </div>
      <div class="filter-search">
        <input v-model="searchQuery" type="text" placeholder="Search incidents..." />
      </div>
    </div>

    <div class="incidents-list">
      <div
        v-for="incident in filteredIncidents"
        :key="incident.id"
        :class="['incident-card', incident.severity]"
      >
        <div class="incident-header">
          <div class="incident-severity">
            <span :class="['severity-badge', incident.severity]">
              {{ incident.severity.toUpperCase() }}
            </span>
            <span class="incident-type">{{ incident.type }}</span>
          </div>
          <span class="incident-time">{{ formatTime(incident.timestamp) }}</span>
        </div>

        <div class="incident-content">
          <h4>{{ incident.title }}</h4>
          <p>{{ incident.description }}</p>
        </div>

        <div class="incident-details">
          <div class="detail-item">
            <span class="detail-label">User:</span>
            <span class="detail-value">{{ incident.user }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">IP:</span>
            <span class="detail-value">{{ incident.ip }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Location:</span>
            <span class="detail-value">{{ incident.location }}</span>
          </div>
        </div>

        <div class="incident-actions">
          <WorkOSButton
            v-if="incident.status !== 'resolved'"
            variant="secondary"
            sm
            @click="viewDetails(incident)"
          >
            View Details
          </WorkOSButton>
          <WorkOSButton
            v-if="incident.status === 'pending'"
            variant="primary"
            sm
            @click="resolveIncident(incident.id)"
          >
            Mark Resolved
          </WorkOSButton>
          <WorkOSButton
            v-if="incident.status === 'pending' && incident.severity === 'critical'"
            variant="danger"
            sm
            @click="blockUser(incident.userId)"
          >
            Block User
          </WorkOSButton>
        </div>
      </div>

      <div v-if="filteredIncidents.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>No incidents found</p>
      </div>
    </div>

    <div class="threat-map">
      <h3>Geographic Distribution</h3>
      <div class="map-placeholder">
        <div class="map-grid">
          <div
            v-for="region in threatRegions"
            :key="region.name"
            class="region-item"
          >
            <span class="region-name">{{ region.name }}</span>
            <div class="region-bar">
              <div
                class="region-fill"
                :style="{ width: `${region.percentage}%` }"
              ></div>
            </div>
            <span class="region-count">{{ region.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <WorkOSModal
      :show="showDetailModal"
      title="Incident Details"
      large
      @close="showDetailModal = false"
    >
      <div v-if="selectedIncident" class="incident-detail-modal">
        <div class="detail-section">
          <h4>Summary</h4>
          <p>{{ selectedIncident.description }}</p>
        </div>
        <div class="detail-section">
          <h4>Technical Details</h4>
          <div class="tech-details">
            <div class="tech-row">
              <span>User Agent:</span>
              <code>{{ selectedIncident.userAgent }}</code>
            </div>
            <div class="tech-row">
              <span>Request Path:</span>
              <code>{{ selectedIncident.requestPath }}</code>
            </div>
            <div class="tech-row">
              <span>Timestamp:</span>
              <code>{{ selectedIncident.timestamp.toISOString() }}</code>
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

interface Incident {
  id: string
  type: string
  severity: "critical" | "warning" | "info"
  status: "pending" | "investigating" | "resolved"
  title: string
  description: string
  user: string
  userId: string
  ip: string
  location: string
  timestamp: Date
  userAgent?: string
  requestPath?: string
}

interface ThreatRegion {
  name: string
  count: number
  percentage: number
}

const timeRange = ref("7d")
const activeFilter = ref("all")
const searchQuery = ref("")
const showDetailModal = ref(false)
const selectedIncident = ref<Incident | null>(null)

const stats = ref({
  criticalIncidents: 3,
  warningIncidents: 12,
  blockedAttempts: 156,
  resolvedIncidents: 45,
})

const filters = computed(() => [
  { label: "All", value: "all", count: incidents.value.length },
  { label: "Critical", value: "critical", count: incidents.value.filter(i => i.severity === "critical").length },
  { label: "Warning", value: "warning", count: incidents.value.filter(i => i.severity === "warning").length },
  { label: "Pending", value: "pending", count: incidents.value.filter(i => i.status === "pending").length },
])

const incidents = ref<Incident[]>([
  {
    id: "1",
    type: "Brute Force",
    severity: "critical",
    status: "pending",
    title: "Multiple failed login attempts detected",
    description: "User attempted to login 15 times within 5 minutes from different IPs",
    user: "john.doe@example.com",
    userId: "user1",
    ip: "203.0.113.1",
    location: "Singapore",
    timestamp: new Date(Date.now() - 3600000),
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    requestPath: "/api/auth/login",
  },
  {
    id: "2",
    type: "Suspicious Login",
    severity: "warning",
    status: "investigating",
    title: "Login from unusual location",
    description: "User logged in from a location they don't typically access",
    user: "jane.smith@example.com",
    userId: "user2",
    ip: "198.51.100.1",
    location: "Russia",
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: "3",
    type: "Account Takeover",
    severity: "critical",
    status: "pending",
    title: "Possible account compromise",
    description: "Password changed followed by immediate login from new device",
    user: "admin@company.com",
    userId: "user3",
    ip: "192.0.2.1",
    location: "China",
    timestamp: new Date(Date.now() - 10800000),
  },
  {
    id: "4",
    type: "API Abuse",
    severity: "warning",
    status: "resolved",
    title: "Rate limit exceeded",
    description: "User exceeded API rate limit multiple times",
    user: "developer@example.com",
    userId: "user4",
    ip: "203.0.113.50",
    location: "United States",
    timestamp: new Date(Date.now() - 86400000),
  },
])

const threatRegions = ref<ThreatRegion[]>([
  { name: "Russia", count: 45, percentage: 85 },
  { name: "China", count: 38, percentage: 72 },
  { name: "Singapore", count: 25, percentage: 47 },
  { name: "Brazil", count: 18, percentage: 34 },
  { name: "India", count: 12, percentage: 23 },
])

const filteredIncidents = computed(() => {
  let result = incidents.value

  if (activeFilter.value !== "all") {
    if (activeFilter.value === "pending") {
      result = result.filter(i => i.status === "pending")
    } else {
      result = result.filter(i => i.severity === activeFilter.value)
    }
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(i =>
      i.title.toLowerCase().includes(query) ||
      i.description.toLowerCase().includes(query) ||
      i.user.toLowerCase().includes(query)
    )
  }

  return result
})

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const viewDetails = (incident: Incident) => {
  selectedIncident.value = incident
  showDetailModal.value = true
}

const resolveIncident = (id: string) => {
  const incident = incidents.value.find(i => i.id === id)
  if (incident) {
    incident.status = "resolved"
    stats.value.resolvedIncidents++
  }
}

const blockUser = (userId: string) => {
  incidents.value = incidents.value.filter(i => i.userId !== userId)
}

const exportReport = () => {
  const data = JSON.stringify(incidents.value, null, 2)
  const blob = new Blob([data], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "security-report.json"
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.security-dashboard {
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
  margin-bottom: 2rem;
}

.dashboard-header h2 {
  margin: 0;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.time-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
}

.security-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 8px;
  background: #f9fafb;
}

.stat-card.critical {
  background: #fef2f2;
  border-left: 4px solid #dc2626;
}

.stat-card.warning {
  background: #fffbeb;
  border-left: 4px solid #f59e0b;
}

.stat-card.blocked {
  background: #eff6ff;
  border-left: 4px solid #2563eb;
}

.stat-card.resolved {
  background: #f0fdf4;
  border-left: 4px solid #10b981;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.incident-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
}

.filter-tab {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.filter-tab.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.filter-count {
  background: #e5e7eb;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.filter-tab.active .filter-count {
  background: rgba(255, 255, 255, 0.2);
}

.filter-search input {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  width: 250px;
}

.incidents-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.incident-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.2s;
}

.incident-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.incident-card.critical {
  border-left: 4px solid #dc2626;
}

.incident-card.warning {
  border-left: 4px solid #f59e0b;
}

.incident-card.info {
  border-left: 4px solid #3b82f6;
}

.incident-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.incident-severity {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.severity-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 700;
}

.severity-badge.critical {
  background: #fef2f2;
  color: #dc2626;
}

.severity-badge.warning {
  background: #fffbeb;
  color: #d97706;
}

.severity-badge.info {
  background: #eff6ff;
  color: #2563eb;
}

.incident-type {
  color: #6b7280;
  font-size: 0.875rem;
}

.incident-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

.incident-content h4 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.incident-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.incident-details {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.detail-item {
  display: flex;
  gap: 0.5rem;
}

.detail-label {
  color: #9ca3af;
  font-size: 0.75rem;
}

.detail-value {
  color: #374151;
  font-size: 0.75rem;
}

.incident-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.threat-map {
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.threat-map h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.map-placeholder {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
}

.map-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.region-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.region-name {
  width: 100px;
  font-size: 0.875rem;
  color: #374151;
}

.region-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.region-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #dc2626);
  border-radius: 4px;
}

.region-count {
  width: 40px;
  text-align: right;
  font-size: 0.875rem;
  color: #6b7280;
}

.incident-detail-modal {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section h4 {
  margin: 0 0 0.75rem 0;
  color: #1f2937;
}

.tech-details {
  background: #f3f4f6;
  border-radius: 6px;
  padding: 1rem;
}

.tech-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tech-row:last-child {
  margin-bottom: 0;
}

.tech-row span {
  color: #6b7280;
  font-size: 0.875rem;
}

.tech-row code {
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #374151;
}
</style>
