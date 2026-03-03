<template>
  <WorkOSDataTable :columns="columns" :data="usersAsRecords" row-key="id">
    <template #user="{ row }">
      <div class="user-info">
        <img v-if="row.profilePictureUrl" :src="String(row.profilePictureUrl)" :alt="String(row.firstName)" class="avatar" />
        <div v-else class="avatar-placeholder">{{ String(row.firstName)?.[0] }}{{ String(row.lastName)?.[0] }}</div>
        <span>{{ row.firstName }} {{ row.lastName }}</span>
      </div>
    </template>
    <template #role="{ value }">
      <span class="role-badge" :class="String(value).toLowerCase()">{{ value }}</span>
    </template>
    <template #lastAccessAt="{ value }">
      {{ formatDate(String(value)) }}
    </template>
    <template #actions="{ row }">
      <div class="action-buttons">
        <button class="btn-icon" title="Edit" @click="handleEdit(row)">✏️</button>
        <button class="btn-icon" title="Revoke Session" @click="handleRevoke(row)">🚫</button>
      </div>
    </template>
  </WorkOSDataTable>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { WorkOSDashboardUser } from "../../shared/types/dashboard"
import WorkOSDataTable from "../base/WorkOSDataTable.vue"

const props = defineProps<{
	users: WorkOSDashboardUser[]
}>()

const emit = defineEmits<{
	edit: [user: WorkOSDashboardUser]
	revoke: [userId: string]
}>()

const usersAsRecords = computed(() => props.users as Record<string, unknown>[])

const columns = [
	{ key: "user", label: "User" },
	{ key: "email", label: "Email" },
	{ key: "organizationName", label: "Organization" },
	{ key: "role", label: "Role" },
	{ key: "lastAccessAt", label: "Last Active" },
	{ key: "actions", label: "Actions" },
]

const formatDate = (dateString: string) => new Date(dateString).toLocaleString()

const handleEdit = (row: Record<string, unknown>) => {
	emit("edit", row as WorkOSDashboardUser)
}

const handleRevoke = (row: Record<string, unknown>) => {
	emit("revoke", String(row.id))
}
</script>

<style scoped>
.user-info {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.avatar,
.avatar-placeholder {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: #e5e7eb;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.875rem;
	font-weight: 600;
}

.role-badge {
	padding: 0.25rem 0.75rem;
	border-radius: 9999px;
	font-size: 0.875rem;
	font-weight: 500;
}

.role-badge.admin {
	background: #fef3c7;
	color: #92400e;
}

.role-badge.user {
	background: #dbeafe;
	color: #1e40af;
}

.action-buttons {
	display: flex;
	gap: 0.5rem;
}

.btn-icon {
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.25rem;
	border-radius: 4px;
	transition: background-color 0.2s;
}

.btn-icon:hover {
	background: #f3f4f6;
}
</style>
