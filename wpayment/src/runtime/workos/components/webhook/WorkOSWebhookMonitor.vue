<template>
  <div class="webhook-monitor">
    <div class="monitor-header">
      <h2>Webhook Monitor</h2>
      <div class="header-actions">
        <WorkOSButton variant="primary" @click="refreshData">Refresh</WorkOSButton>
        <WorkOSButton variant="secondary" @click="showCreateModal = true">Add Webhook</WorkOSButton>
      </div>
    </div>

    <div class="monitor-stats">
      <WorkOSStatCard :value="stats.totalWebhooks" label="Total Webhooks" />
      <WorkOSStatCard :value="stats.activeWebhooks" label="Active" />
      <WorkOSStatCard :value="stats.recentDeliveries" label="Recent Deliveries" />
      <WorkOSStatCard :value="stats.failedDeliveries" label="Failed (24h)" />
    </div>

    <div class="webhooks-section">
      <h3>Webhooks</h3>
      <div class="webhooks-list">
        <WorkOSWebhookCard
          v-for="webhook in webhooks"
          :key="webhook.id"
          :webhook="webhook"
          @test="testWebhook(webhook.id)"
          @edit="editWebhook(webhook)"
          @toggle="toggleWebhook(webhook)"
          @delete="deleteWebhook(webhook.id)"
        />
      </div>
    </div>

    <div class="deliveries-section">
      <h3>Recent Deliveries</h3>
      <WorkOSDeliveryTable
        :deliveries="deliveries"
        :webhooks="webhooks"
        @view="viewDelivery"
        @retry="retryDelivery"
      />
    </div>

    <WorkOSWebhookFormModal
      :show="showCreateModal"
      :editing="editingWebhook"
      :available-events="availableEvents"
      @close="closeCreateModal"
      @submit="saveWebhook"
    />

    <WorkOSDeliveryDetailsModal
      :show="showDeliveryModal"
      :delivery="selectedDelivery"
      :webhooks="webhooks"
      @close="showDeliveryModal = false"
      @retry="retrySelectedDelivery"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import type { WorkOSWebhookConfig, WorkOSWebhookDelivery } from "../../composables/useWorkOSWebhooks"
import { useWorkOSWebhooks } from "../../composables/useWorkOSWebhooks"
import WorkOSButton from "../base/WorkOSButton.vue"
import WorkOSStatCard from "../base/WorkOSStatCard.vue"
import WorkOSWebhookCard from "../webhook-monitor/WorkOSWebhookCard.vue"
import WorkOSDeliveryTable from "../webhook-monitor/WorkOSDeliveryTable.vue"
import WorkOSWebhookFormModal from "../webhook-monitor/WorkOSWebhookFormModal.vue"
import WorkOSDeliveryDetailsModal from "../webhook-monitor/WorkOSDeliveryDetailsModal.vue"

interface WebhookMonitorStats {
	totalWebhooks: number
	activeWebhooks: number
	recentDeliveries: number
	failedDeliveries: number
}

interface WebhookFormData {
	name: string
	url: string
	events: string[]
	secret?: string
	headersJson?: string
	retryPolicy: {
		maxRetries: number
		retryDelay: number
	}
}

const stats = ref<WebhookMonitorStats>({
	totalWebhooks: 0,
	activeWebhooks: 0,
	recentDeliveries: 0,
	failedDeliveries: 0,
})

const webhooks = ref<WorkOSWebhookConfig[]>([])
const deliveries = ref<WorkOSWebhookDelivery[]>([])
const showCreateModal = ref(false)
const showDeliveryModal = ref(false)
const editingWebhook = ref<WorkOSWebhookConfig | null>(null)
const selectedDelivery = ref<WorkOSWebhookDelivery | null>(null)

const {
	getWebhooks,
	createWebhook,
	updateWebhook,
	deleteWebhook: deleteWebhookApi,
	testWebhook: testWebhookApi,
	retryWebhookDelivery,
} = useWorkOSWebhooks()

const availableEvents = [
	"user.created",
	"user.updated",
	"user.deleted",
	"organization.created",
	"organization.updated",
	"organization.deleted",
	"session.created",
	"session.deleted",
	"role.assigned",
	"role.revoked",
]

const refreshData = async () => {
	try {
		const [statsData, webhooksData, deliveriesData] = await Promise.all([
			$fetch<WebhookMonitorStats>("/api/workos/webhooks/stats"),
			getWebhooks(),
			$fetch<WorkOSWebhookDelivery[]>("/api/workos/webhooks/deliveries"),
		])
		stats.value = statsData
		webhooks.value = webhooksData
		deliveries.value = deliveriesData
	} catch (error) {
		console.error("Failed to refresh data:", error)
	}
}

const saveWebhook = async (form: WebhookFormData) => {
	try {
		const headers = form.headersJson ? JSON.parse(form.headersJson) : {}
		const data = {
			name: form.name,
			url: form.url,
			events: form.events,
			secret: form.secret || undefined,
			active: true,
			retryPolicy: form.retryPolicy,
			headers: Object.keys(headers).length > 0 ? headers : undefined,
		}

		if (editingWebhook.value) {
			await updateWebhook(editingWebhook.value.id, data)
		} else {
			await createWebhook(data)
		}
		closeCreateModal()
		await refreshData()
	} catch (error) {
		console.error("Failed to save webhook:", error)
	}
}

const editWebhook = (webhook: WebhookConfig) => {
	editingWebhook.value = webhook
	showCreateModal.value = true
}

const closeCreateModal = () => {
	showCreateModal.value = false
	editingWebhook.value = null
}

const toggleWebhook = async (webhook: WebhookConfig) => {
	try {
		await updateWebhook(webhook.id, { active: !webhook.active })
		await refreshData()
	} catch (error) {
		console.error("Failed to toggle webhook:", error)
	}
}

const deleteWebhook = async (webhookId: string) => {
	if (!confirm("Are you sure you want to delete this webhook?")) return
	try {
		await deleteWebhookApi(webhookId)
		await refreshData()
	} catch (error) {
		console.error("Failed to delete webhook:", error)
	}
}

const testWebhook = async (webhookId: string) => {
	try {
		const result = await testWebhookApi(webhookId)
		if (result.success) {
			alert("Webhook test sent successfully!")
			await refreshData()
		} else {
			alert("Webhook test failed. Please check the configuration.")
		}
	} catch (error) {
		console.error("Failed to test webhook:", error)
		alert("Failed to test webhook. Please try again.")
	}
}

const viewDelivery = (delivery: WebhookDelivery) => {
	selectedDelivery.value = delivery
	showDeliveryModal.value = true
}

const retryDelivery = async (deliveryId: string) => {
	try {
		await retryWebhookDelivery(deliveryId)
		await refreshData()
	} catch (error) {
		console.error("Failed to retry delivery:", error)
	}
}

const retrySelectedDelivery = async () => {
	if (selectedDelivery.value) {
		await retryDelivery(selectedDelivery.value.id)
		showDeliveryModal.value = false
	}
}

onMounted(() => {
	refreshData()
})
</script>

<style scoped>
.webhook-monitor {
	padding: 2rem;
	max-width: 1400px;
	margin: 0 auto;
}

.monitor-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
}

.monitor-header h2 {
	margin: 0;
	color: #1f2937;
}

.header-actions {
	display: flex;
	gap: 1rem;
}

.monitor-stats {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
	margin-bottom: 2rem;
}

.webhooks-section,
.deliveries-section {
	background: white;
	border-radius: 8px;
	padding: 1.5rem;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	margin-bottom: 2rem;
}

.webhooks-section h3,
.deliveries-section h3 {
	margin: 0 0 1rem 0;
	color: #1f2937;
}

.webhooks-list {
	display: grid;
	gap: 1rem;
}
</style>
