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
      @close="closeDetails"
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
import type { Incident } from "../../../types/security"
import { useSecurityDashboard } from "../../../composables/useSecurityDashboard"
import WorkOSButton from "./base/WorkOSButton.vue"
import WorkOSModal from "./base/WorkOSModal.vue"

const {
  timeRange,
  activeFilter,
  searchQuery,
  showDetailModal,
  selectedIncident,
  stats,
  threatRegions,
  filters,
  filteredIncidents,
  formatTime,
  viewDetails,
  closeDetails,
  resolveIncident,
  blockUser,
  exportReport,
} = useSecurityDashboard()
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
