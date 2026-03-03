<script setup lang="ts">
import WorkOSButton from "./base/WorkOSButton.vue"
import ConnectionCard from "./sso/ConnectionCard.vue"
import HealthTrends from "./sso/HealthTrends.vue"
import AddConnectionModal from "./sso/AddConnectionModal.vue"
import TestConnectionModal from "./sso/TestConnectionModal.vue"

const { connections, healthTrend, overallStatus, overallStatusLabel } = useSSOHealth()
const { getStatusIcon } = useSSOFormatters()
const { showTestModal, testInProgress, testResult, testConnection } = useSSOTesting()
const { showAddConnection, newConnection, openAddModal, saveConnection } = useSSOConnectionForm()

const runAllChecks = async () => {
  // Run all health checks
}

const viewLogs = () => {
  // View logs
}

const editConnection = () => {
  // Edit connection
}
</script>

<template>
  <div class="sso-health-check">
    <div class="health-header">
      <h2>SSO Connection Health</h2>
      <div class="header-actions">
        <WorkOSButton variant="secondary" @click="runAllChecks">Run All Checks</WorkOSButton>
        <WorkOSButton variant="primary" @click="openAddModal">Add Connection</WorkOSButton>
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
      <ConnectionCard
        v-for="connection in connections"
        :key="connection.id"
        :connection="connection"
        @test="testConnection"
        @view-logs="viewLogs"
        @edit="editConnection"
      />
    </div>

    <HealthTrends :trend="healthTrend" />

    <AddConnectionModal
      v-model:show="showAddConnection"
      v-model:model-value="newConnection"
      @save="saveConnection"
    />

    <TestConnectionModal
      v-model:show="showTestModal"
      :in-progress="testInProgress"
      :result="testResult"
    />
  </div>
</template>

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
</style>
