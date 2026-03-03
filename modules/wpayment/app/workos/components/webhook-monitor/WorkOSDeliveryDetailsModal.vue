<template>
  <WorkOSModal :show="show" title="Delivery Details" large @close="$emit('close')">
    <div class="delivery-details">
      <div class="detail-section">
        <h4>Information</h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">Delivery ID:</span>
            <span>{{ delivery?.id }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Webhook:</span>
            <span>{{ getWebhookName(delivery?.webhookId) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Event:</span>
            <span>{{ delivery?.eventId }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Status:</span>
            <span class="status-badge" :class="delivery?.status">{{ delivery?.status }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Attempt:</span>
            <span>{{ delivery?.attempt }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Created:</span>
            <span>{{ formatDate(delivery?.createdAt) }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h4>Payload</h4>
        <pre class="code-block">{{ JSON.stringify(delivery?.payload, null, 2) }}</pre>
      </div>

      <div v-if="delivery?.responseCode" class="detail-section">
        <h4>Response</h4>
        <div class="response-info">
          <div class="response-header">
            <span class="response-code" :class="getResponseClass(delivery.responseCode)">
              {{ delivery.responseCode }}
            </span>
            <span v-if="delivery.deliveredAt">Delivered: {{ formatDate(delivery.deliveredAt) }}</span>
          </div>
          <pre v-if="delivery.responseBody" class="code-block">{{ delivery.responseBody }}</pre>
        </div>
      </div>
    </div>
    <template #footer>
      <WorkOSButton variant="secondary" @click="$emit('close')">Close</WorkOSButton>
      <WorkOSButton v-if="delivery?.status === 'failed'" variant="primary" @click="$emit('retry')">Retry</WorkOSButton>
    </template>
  </WorkOSModal>
</template>

<script setup lang="ts">
import WorkOSModal from "../base/WorkOSModal.vue"
import WorkOSButton from "../base/WorkOSButton.vue"

import type { WorkOSWebhookDelivery } from "../../shared/types/webhooks"

const props = defineProps<{
  show: boolean
  delivery: WorkOSWebhookDelivery | null
  webhooks: WorkOSWebhookConfig[]
}>()

defineEmits<{
  close: []
  retry: []
}>()

const formatDate = (dateString?: string) => (dateString ? new Date(dateString).toLocaleString() : "-")

const getWebhookName = (webhookId?: string): string => {
	if (!webhookId) return "-"
	const webhook = props.webhooks.find((w) => w.id === webhookId)
	return webhook ? webhook.name : webhookId
}

const getResponseClass = (code: number): string => {
	if (code >= 200 && code < 300) return "success"
	if (code >= 400) return "error"
	return ""
}
</script>

<style scoped>
.delivery-details {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.detail-section h4 {
	margin: 0 0 1rem 0;
	color: #1f2937;
}

.detail-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1rem;
}

.detail-item {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.detail-item .label {
	font-weight: 500;
	color: #374151;
	font-size: 0.875rem;
}

.status-badge {
	padding: 0.25rem 0.75rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 500;
	display: inline-block;
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

.code-block {
	background: #f9fafb;
	border: 1px solid #e5e7eb;
	border-radius: 4px;
	padding: 1rem;
	font-family: monospace;
	font-size: 0.875rem;
	overflow-x: auto;
	white-space: pre-wrap;
	word-break: break-all;
}

.response-info {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.response-header {
	display: flex;
	align-items: center;
	gap: 1rem;
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

.response-code.error {
	background: #fee2e2;
	color: #991b1b;
}
</style>
