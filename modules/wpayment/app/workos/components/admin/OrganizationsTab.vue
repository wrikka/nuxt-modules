<script setup lang="ts">
import type { Organization } from "../../composables/useAdminPortal"

const props = defineProps<{
  organizations: Organization[]
}>()

const emit = defineEmits<{
  create: []
  select: [org: Organization]
}>()
</script>

<template>
  <section class="tab-section">
    <div class="section-header">
      <h2>Organizations</h2>
      <WorkOSButton variant="primary" @click="emit('create')">Create Organization</WorkOSButton>
    </div>
    <div class="org-grid">
      <div v-for="org in organizations" :key="org.id" class="org-card" @click="emit('select', org)">
        <div class="org-logo">{{ org.name.charAt(0) }}</div>
        <div class="org-info">
          <h3>{{ org.name }}</h3>
          <p>{{ org.memberCount }} members</p>
          <span class="org-status active">active</span>
        </div>
        <div class="org-stats">
          <div class="stat">
            <span class="stat-value">{{ org.activeUsers }}</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ org.ssoConnections }}</span>
            <span class="stat-label">SSO</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tab-section {
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2937;
}

.org-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.org-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.org-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.org-logo {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2563eb;
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  border-radius: 8px;
}

.org-info {
  flex: 1;
}

.org-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #1f2937;
}

.org-info p {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.org-status {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  text-transform: capitalize;
}

.org-status.active {
  background: #d1fae5;
  color: #059669;
}

.org-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}
</style>
