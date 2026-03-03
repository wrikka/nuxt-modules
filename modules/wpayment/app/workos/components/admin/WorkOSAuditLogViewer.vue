<script setup lang="ts">
import WorkOSButton from "./base/WorkOSButton.vue"
import AuditFilters from "./audit/AuditFilters.vue"
import AuditTable from "./audit/AuditTable.vue"
import AuditPagination from "./audit/AuditPagination.vue"
import AuditDetailModal from "./audit/AuditDetailModal.vue"

const props = defineProps<{
  organizationId?: string
}>()

const {
  loading,
  logs,
  filters,
  pagination,
  visiblePages,
  formatDate,
  formatTime,
  formatDateTime,
  formatAction,
  getActionClass,
  clearFilters,
  prevPage,
  nextPage,
  goToPage,
} = useAuditLogs()

const {
  showDetailModal,
  selectedLog,
  showLogDetail,
  closeDetailModal,
} = useAuditDetail()

const refreshLogs = () => {
  console.log('Refresh logs for org:', props.organizationId)
}

const exportLogs = () => {
  console.log('Export logs')
}
</script>

<template>
  <div class="audit-log-viewer">
    <div class="viewer-header">
      <h2>Audit Logs</h2>
      <div class="header-actions">
        <WorkOSButton variant="secondary" @click="exportLogs">Export</WorkOSButton>
        <WorkOSButton variant="secondary" @click="refreshLogs">Refresh</WorkOSButton>
      </div>
    </div>

    <AuditFilters v-model="filters" @clear="clearFilters" />

    <AuditTable
      :logs="logs"
      :loading="loading"
      :format-date="formatDate"
      :format-time="formatTime"
      :format-action="formatAction"
      :get-action-class="getActionClass"
      @view="showLogDetail"
    />

    <AuditPagination
      :current="pagination.current"
      :total="pagination.total"
      :from="pagination.from"
      :to="pagination.to"
      :has-prev="pagination.hasPrev"
      :has-next="pagination.hasNext"
      :visible-pages="visiblePages"
      @prev="prevPage"
      @next="nextPage"
      @go-to="goToPage"
    />

    <AuditDetailModal
      :show="showDetailModal"
      :log="selectedLog"
      :format-date-time="formatDateTime"
      @close="closeDetailModal"
    />
  </div>
</template>

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
</style>
