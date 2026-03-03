<script setup lang="ts">
import type { AuditFilters } from "../../composables/useAuditLogs"

const props = defineProps<{
  modelValue: AuditFilters
}>()

const emit = defineEmits<{
  'update:modelValue': [filters: AuditFilters]
  clear: []
}>()

const filters = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
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
      <WorkOSButton variant="secondary" size="sm" @click="emit('clear')">Clear Filters</WorkOSButton>
    </div>
  </div>
</template>

<style scoped>
.filters-section {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
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
  border-radius: 6px;
  font-size: 0.875rem;
}

.filter-actions {
  margin-top: 0.75rem;
  text-align: right;
}
</style>
