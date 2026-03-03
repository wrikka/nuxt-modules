<template>
  <div class="session-card">
    <div class="session-header">
      <h3>{{ session.organizationName }}</h3>
      <span class="session-status" :class="session.isActive ? 'active' : 'inactive'">
        {{ session.isActive ? "Active" : "Inactive" }}
      </span>
    </div>
    <div class="session-details">
      <p><strong>User:</strong> {{ session.userName }}</p>
      <p><strong>Role:</strong> {{ session.role }}</p>
      <p><strong>Created:</strong> {{ formatDate(session.createdAt) }}</p>
      <p><strong>Expires:</strong> {{ formatDate(session.expiresAt) }}</p>
    </div>
    <div class="session-actions">
      <WorkOSButton variant="primary" sm @click="$emit('switch')">Switch</WorkOSButton>
      <WorkOSButton variant="danger" sm @click="$emit('revoke')">Revoke</WorkOSButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import WorkOSButton from "../base/WorkOSButton.vue"

interface OrganizationSession {
	id: string
	organizationName: string
	userName: string
	role: string
	isActive: boolean
	createdAt: string
	expiresAt: string
}

defineProps<{
	session: OrganizationSession
}>()

defineEmits<{
	switch: []
	revoke: []
}>()

const formatDate = (dateString: string) => new Date(dateString).toLocaleString()
</script>

<style scoped>
.session-card {
	background: white;
	border-radius: 8px;
	padding: 1rem;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.session-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
}

.session-header h3 {
	margin: 0;
	color: #1f2937;
}

.session-status {
	padding: 0.25rem 0.75rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 500;
}

.session-status.active {
	background: #d1fae5;
	color: #065f46;
}

.session-status.inactive {
	background: #fee2e2;
	color: #991b1b;
}

.session-details p {
	margin: 0.5rem 0;
	font-size: 0.875rem;
}

.session-actions {
	display: flex;
	gap: 0.5rem;
	margin-top: 1rem;
}
</style>
