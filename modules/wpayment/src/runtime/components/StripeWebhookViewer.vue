<template>
	<div class="stripe-webhook-viewer">
		<div class="viewer-header">
			<h2 class="viewer-title">{{ title }}</h2>
			<div class="viewer-controls">
				<select v-model="selectedType" class="type-select">
					<option value="">All Events</option>
					<option value="payment">Payment Events</option>
					<option value="subscription">Subscription Events</option>
					<option value="customer">Customer Events</option>
					<option value="invoice">Invoice Events</option>
				</select>
				<select v-model="selectedStatus" class="status-select">
					<option value="">All Status</option>
					<option value="succeeded">Succeeded</option>
					<option value="failed">Failed</option>
					<option value="pending">Pending</option>
				</select>
				<button class="test-btn" @click="showTestModal = true">Send Test Event</button>
			</div>
		</div>

		<div class="events-list">
			<div v-if="events.length === 0" class="empty-state">
				<span class="empty-icon">📭</span>
				<p class="empty-text">No webhook events found</p>
			</div>

			<div v-for="event in filteredEvents" :key="event.id" class="event-item" @click="selectEvent(event)">
				<div class="event-header">
					<span class="event-type">{{ event.type }}</span>
					<span :class="['event-status', event.status || 'succeeded']">
						{{ event.status || 'succeeded' }}
					</span>
				</div>
				<div class="event-meta">
					<span class="event-id">{{ event.id }}</span>
					<span class="event-time">{{ formatTime(event.created) }}</span>
				</div>
				<div class="event-preview">
					<code class="event-object">{{ event.data.object?.object || 'unknown' }}</code>
					<span class="event-livemode" :class="{ live: event.livemode }">
						{{ event.livemode ? 'Live' : 'Test' }}
					</span>
				</div>
			</div>
		</div>

		<div v-if="selectedEventDetail" class="event-detail-panel">
			<div class="detail-header">
				<h3 class="detail-title">Event Details</h3>
				<button class="close-btn" @click="selectedEventDetail = null">×</button>
			</div>

			<div class="detail-content">
				<div class="detail-section">
					<h4 class="section-label">Event ID</h4>
					<code class="section-value">{{ selectedEventDetail.id }}</code>
				</div>

				<div class="detail-section">
					<h4 class="section-label">Type</h4>
					<code class="section-value">{{ selectedEventDetail.type }}</code>
				</div>

				<div class="detail-section">
					<h4 class="section-label">Created</h4>
					<span class="section-value">{{ formatDateTime(selectedEventDetail.created) }}</span>
				</div>

				<div class="detail-section">
					<h4 class="section-label">API Version</h4>
					<code class="section-value">{{ selectedEventDetail.api_version || 'N/A' }}</code>
				</div>

				<div class="detail-section">
					<h4 class="section-label">Payload</h4>
					<pre class="payload-code">{{ JSON.stringify(selectedEventDetail.data, null, 2) }}</pre>
				</div>

				<div class="detail-section" v-if="selectedEventDetail.request">
					<h4 class="section-label">Request ID</h4>
					<code class="section-value">{{ selectedEventDetail.request.id || 'N/A' }}</code>
				</div>
			</div>

			<div class="detail-actions">
				<button class="retry-btn" @click="retryEvent(selectedEventDetail)" :disabled="retrying">
					{{ retrying ? 'Retrying...' : 'Retry' }}
				</button>
				<button class="copy-btn" @click="copyPayload">Copy Payload</button>
			</div>
		</div>

		<div v-if="showTestModal" class="modal-overlay" @click.self="showTestModal = false">
			<div class="modal-content">
				<h3 class="modal-title">Send Test Event</h3>
				<div class="modal-body">
					<label class="form-label">Event Type</label>
					<select v-model="testEventType" class="form-select">
						<option value="payment_intent.succeeded">payment_intent.succeeded</option>
						<option value="payment_intent.payment_failed">payment_intent.payment_failed</option>
						<option value="customer.created">customer.created</option>
						<option value="invoice.paid">invoice.paid</option>
						<option value="subscription.created">subscription.created</option>
					</select>
				</div>
				<div class="modal-actions">
					<button class="btn-secondary" @click="showTestModal = false">Cancel</button>
					<button class="btn-primary" @click="sendTestEvent" :disabled="sending">
						{{ sending ? 'Sending...' : 'Send' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { WebhookEvent, WebhookEventFilter } from "#wpayment/types";

interface Props {
	title?: string;
	events?: WebhookEvent[];
}

const props = withDefaults(defineProps<Props>(), {
	title: "Webhook Events",
	events: () => [],
});

const emit = defineEmits<{
	filterChange: [filter: WebhookEventFilter];
	retryEvent: [event: WebhookEvent];
	sendTestEvent: [type: string];
}>();

const selectedType = ref("");
const selectedStatus = ref("");
const selectedEventDetail = ref<WebhookEvent | null>(null);
const showTestModal = ref(false);
const testEventType = ref("payment_intent.succeeded");
const retrying = ref(false);
const sending = ref(false);

const filteredEvents = computed(() => {
	let result = props.events;

	if (selectedType.value) {
		const categoryMap: Record<string, string[]> = {
			payment: ["payment_intent", "charge", "payment_method"],
			subscription: ["subscription", "plan", "price"],
			customer: ["customer", "tax_id"],
			invoice: ["invoice", "credit_note"],
		};
		const prefixes = categoryMap[selectedType.value] || [];
		result = result.filter((e) => prefixes.some((p) => e.type.startsWith(p)));
	}

	if (selectedStatus.value) {
		result = result.filter((e) => e.status === selectedStatus.value);
	}

	return result;
});

const selectEvent = (event: WebhookEvent) => {
	selectedEventDetail.value = event;
};

const retryEvent = async (event: WebhookEvent) => {
	retrying.value = true;
	emit("retryEvent", event);
	setTimeout(() => {
		retrying.value = false;
	}, 1000);
};

const sendTestEvent = () => {
	sending.value = true;
	emit("sendTestEvent", testEventType.value);
	setTimeout(() => {
		sending.value = false;
		showTestModal.value = false;
	}, 1000);
};

const copyPayload = () => {
	if (selectedEventDetail.value) {
		navigator.clipboard.writeText(JSON.stringify(selectedEventDetail.value.data, null, 2));
	}
};

const formatTime = (timestamp: number): string => {
	const date = new Date(timestamp * 1000);
	return date.toLocaleTimeString();
};

const formatDateTime = (timestamp: number): string => {
	return new Date(timestamp * 1000).toLocaleString();
};
</script>

<style scoped>
.stripe-webhook-viewer {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	display: grid;
	grid-template-columns: 1fr 400px;
	gap: 24px;
}

.viewer-header {
	grid-column: 1 / -1;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}

.viewer-title {
	font-size: 24px;
	font-weight: 600;
	margin: 0;
}

.viewer-controls {
	display: flex;
	gap: 12px;
}

.type-select,
.status-select {
	padding: 8px 12px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
	background: white;
}

.test-btn {
	padding: 8px 16px;
	background: #635bff;
	color: white;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	cursor: pointer;
}

.test-btn:hover {
	background: #4a4bd9;
}

.events-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
	max-height: 600px;
	overflow-y: auto;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40px;
	background: #f9fafb;
	border-radius: 8px;
}

.empty-icon {
	font-size: 48px;
	margin-bottom: 16px;
}

.empty-text {
	color: #666;
	margin: 0;
}

.event-item {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 16px;
	cursor: pointer;
	transition: border-color 0.2s;
}

.event-item:hover {
	border-color: #635bff;
}

.event-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 8px;
}

.event-type {
	font-family: monospace;
	font-size: 14px;
	font-weight: 500;
}

.event-status {
	font-size: 12px;
	padding: 2px 8px;
	border-radius: 4px;
	text-transform: capitalize;
}

.event-status.succeeded {
	background: #d1fae5;
	color: #065f46;
}

.event-status.failed {
	background: #fee2e2;
	color: #991b1b;
}

.event-status.pending {
	background: #fef3c7;
	color: #92400e;
}

.event-meta {
	display: flex;
	justify-content: space-between;
	font-size: 12px;
	color: #666;
	margin-bottom: 8px;
}

.event-preview {
	display: flex;
	align-items: center;
	gap: 8px;
}

.event-object {
	font-size: 12px;
	background: #f0f0f0;
	padding: 2px 6px;
	border-radius: 4px;
}

.event-livemode {
	font-size: 10px;
	padding: 2px 6px;
	border-radius: 4px;
	background: #e0e0e0;
	color: #666;
}

.event-livemode.live {
	background: #fee2e2;
	color: #991b1b;
}

.event-detail-panel {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
	position: sticky;
	top: 0;
	max-height: 600px;
	overflow-y: auto;
}

.detail-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}

.detail-title {
	font-size: 18px;
	font-weight: 600;
	margin: 0;
}

.close-btn {
	width: 32px;
	height: 32px;
	border: none;
	background: #f0f0f0;
	border-radius: 50%;
	font-size: 20px;
	cursor: pointer;
}

.detail-content {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.detail-section {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.section-label {
	font-size: 12px;
	color: #666;
	margin: 0;
}

.section-value {
	font-size: 14px;
}

.payload-code {
	font-family: monospace;
	font-size: 12px;
	background: #f5f5f5;
	padding: 12px;
	border-radius: 6px;
	overflow-x: auto;
	margin: 0;
	max-height: 200px;
}

.detail-actions {
	display: flex;
	gap: 12px;
	margin-top: 16px;
}

.retry-btn,
.copy-btn {
	flex: 1;
	padding: 10px;
	border-radius: 6px;
	font-size: 14px;
	cursor: pointer;
}

.retry-btn {
	background: #635bff;
	color: white;
	border: none;
}

.retry-btn:disabled {
	opacity: 0.5;
}

.copy-btn {
	background: white;
	border: 1px solid #e0e0e0;
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-content {
	background: white;
	border-radius: 8px;
	padding: 24px;
	width: 400px;
}

.modal-title {
	font-size: 18px;
	font-weight: 600;
	margin: 0 0 16px 0;
}

.modal-body {
	margin-bottom: 16px;
}

.form-label {
	display: block;
	font-size: 14px;
	margin-bottom: 8px;
}

.form-select {
	width: 100%;
	padding: 10px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
}

.modal-actions {
	display: flex;
	gap: 12px;
	justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
	padding: 10px 20px;
	border-radius: 6px;
	font-size: 14px;
	cursor: pointer;
}

.btn-primary {
	background: #635bff;
	color: white;
	border: none;
}

.btn-primary:disabled {
	opacity: 0.5;
}

.btn-secondary {
	background: white;
	border: 1px solid #e0e0e0;
}
</style>
