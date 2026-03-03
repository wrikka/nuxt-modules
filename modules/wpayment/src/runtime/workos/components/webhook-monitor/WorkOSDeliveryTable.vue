<template>
  <WorkOSDataTable :columns="columns" :data="deliveriesAsRecords" row-key="id">
    <template #webhookId="{ value }">
      {{ getWebhookName(String(value)) }}
    </template>
    <template #status="{ value }">
      <span class="status-badge" :class="String(value)">{{ value }}</span>
    </template>
    <template #responseCode="{ value }">
      <span v-if="value" class="response-code" :class="getResponseClass(Number(value))">{{ value }}</span>
      <span v-else>-</span>
    </template>
    <template #createdAt="{ value }">
      {{ formatDate(String(value)) }}
    </template>
    <template #actions="{ row }">
      <div class="action-buttons">
        <button class="btn-icon" title="View Details" @click="handleView(row)">👁️</button>
        <button v-if="row.status === 'failed'" class="btn-icon" title="Retry" @click="handleRetry(row)">🔄</button>
      </div>
    </template>
  </WorkOSDataTable>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { WebhookDelivery } from "../../composables/useWorkOSWebhooks"
import WorkOSDataTable from "../base/WorkOSDataTable.vue"

const props = defineProps<{
	deliveries: WebhookDelivery[]
	webhooks: Array<{ id: string; name: string }>
}>()

const emit = defineEmits<{
	view: [delivery: WebhookDelivery]
	retry: [deliveryId: string]
}>()

const deliveriesAsRecords = computed(() => props.deliveries as unknown as Record<string, unknown>[])

const columns = [
	{ key: "webhookId", label: "Webhook" },
	{ key: "eventId", label: "Event" },
	{ key: "status", label: "Status" },
	{ key: "attempt", label: "Attempt" },
	{ key: "responseCode", label: "Response" },
	{ key: "createdAt", label: "Time" },
	{ key: "actions", label: "Actions" },
]

const formatDate = (dateString: string) => new Date(dateString).toLocaleString()

const getWebhookName = (webhookId: string): string => {
	const webhook = props.webhooks.find((w) => w.id === webhookId)
	return webhook ? webhook.name : webhookId
}

const getResponseClass = (code: number): string => {
	if (code >= 200 && code < 300) return "success"
	if (code >= 400 && code < 500) return "client-error"
	if (code >= 500) return "server-error"
	return ""
}

const handleView = (row: Record<string, unknown>) => {
	emit("view", row as unknown as WebhookDelivery)
}

const handleRetry = (row: Record<string, unknown>) => {
	emit("retry", String(row.id))
}
</script>

<style scoped>
.status-badge {
	padding: 0.25rem 0.75rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 500;
}

.status-badge.delivered {
	background: #d1fae5;
	color: #065f46;
}

.status-badge.failed {
	background: #fee2e2;
	color: #991b1b;
}

.status-badge.pending {
	background: #fef3c7;
	color: #92400e;
}

.status-badge.retrying {
	background: #dbeafe;
	color: #1e40af;
}

.response-code {
	padding: 0.25rem 0.5rem;
	border-radius: 4px;
	font-size: 0.75rem;
	font-weight: 500;
}

.response-code.success {
	background: #d1fae5;
	color: #065f46;
}

.response-code.client-error,
.response-code.server-error {
	background: #fee2e2;
	color: #991b1b;
}

.action-buttons {
	display: flex;
	gap: 0.25rem;
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
