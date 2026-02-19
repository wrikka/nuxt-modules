<template>
  <div class="webhook-card">
    <div class="webhook-header">
      <div class="webhook-info">
        <h4>{{ webhook.name }}</h4>
        <span class="webhook-url">{{ webhook.url }}</span>
      </div>
      <div class="webhook-status">
        <span class="status-badge" :class="webhook.active ? 'active' : 'inactive'">
          {{ webhook.active ? "Active" : "Inactive" }}
        </span>
        <div class="webhook-actions">
          <button class="btn-icon" title="Test" @click="$emit('test')">🧪</button>
          <button class="btn-icon" title="Edit" @click="$emit('edit')">✏️</button>
          <button class="btn-icon" :title="webhook.active ? 'Disable' : 'Enable'" @click="$emit('toggle')">
            {{ webhook.active ? "🔌" : "🔋" }}
          </button>
          <button class="btn-icon" title="Delete" @click="$emit('delete')">🗑️</button>
        </div>
      </div>
    </div>
    <div class="webhook-details">
      <div class="detail-row">
        <span class="label">Events:</span>
        <div class="event-tags">
          <span v-for="event in webhook.events.slice(0, 3)" :key="event" class="event-tag">{{ event }}</span>
          <span v-if="webhook.events.length > 3" class="event-more">+{{ webhook.events.length - 3 }}</span>
        </div>
      </div>
      <div class="detail-row">
        <span class="label">Retry Policy:</span>
        <span>{{ webhook.retryPolicy.maxRetries }} retries, {{ webhook.retryPolicy.retryDelay }}s delay</span>
      </div>
      <div class="detail-row">
        <span class="label">Created:</span>
        <span>{{ formatDate(webhook.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WebhookConfig } from "../../composables/useWorkOSWebhooks"

defineProps<{
	webhook: WebhookConfig
}>()

defineEmits<{
	test: []
	edit: []
	toggle: []
	delete: []
}>()

const formatDate = (dateString: string) => new Date(dateString).toLocaleString()
</script>

<style scoped>
.webhook-card {
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	padding: 1rem;
}

.webhook-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 1rem;
}

.webhook-info h4 {
	margin: 0 0 0.25rem 0;
	color: #1f2937;
}

.webhook-url {
	font-size: 0.875rem;
	color: #6b7280;
	font-family: monospace;
}

.webhook-status {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.status-badge {
	padding: 0.25rem 0.75rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 500;
}

.status-badge.active {
	background: #d1fae5;
	color: #065f46;
}

.status-badge.inactive {
	background: #fee2e2;
	color: #991b1b;
}

.webhook-actions {
	display: flex;
	gap: 0.25rem;
}

.webhook-details {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.detail-row {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.875rem;
}

.detail-row .label {
	font-weight: 500;
	color: #374151;
	min-width: 80px;
}

.event-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.25rem;
}

.event-tag {
	padding: 0.25rem 0.5rem;
	background: #f3f4f6;
	color: #374151;
	border-radius: 4px;
	font-size: 0.75rem;
}

.event-more {
	padding: 0.25rem 0.5rem;
	background: #e5e7eb;
	color: #6b7280;
	border-radius: 4px;
	font-size: 0.75rem;
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
