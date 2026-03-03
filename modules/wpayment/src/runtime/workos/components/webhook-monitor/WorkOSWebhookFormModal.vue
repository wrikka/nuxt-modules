<template>
  <WorkOSModal :show="show" :title="editing ? 'Edit Webhook' : 'Create Webhook'" @close="$emit('close')">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Name</label>
        <input v-model="form.name" type="text" required />
      </div>
      <div class="form-group">
        <label>URL</label>
        <input v-model="form.url" type="url" required />
      </div>
      <div class="form-group">
        <label>Events</label>
        <div class="events-selector">
          <label v-for="event in availableEvents" :key="event" class="event-checkbox">
            <input type="checkbox" :value="event" v-model="form.events" />
            {{ event }}
          </label>
        </div>
      </div>
      <div class="form-group">
        <label>Secret (Optional)</label>
        <input v-model="form.secret" type="password" placeholder="Auto-generated if empty" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Max Retries</label>
          <input v-model.number="form.retryPolicy.maxRetries" type="number" min="0" max="10" />
        </div>
        <div class="form-group">
          <label>Retry Delay (seconds)</label>
          <input v-model.number="form.retryPolicy.retryDelay" type="number" min="1" max="3600" />
        </div>
      </div>
      <div class="form-group">
        <label>Custom Headers (JSON)</label>
        <textarea v-model="form.headersJson" placeholder='{"Authorization": "Bearer token"}'></textarea>
      </div>
    </form>
    <template #footer>
      <WorkOSButton variant="secondary" @click="$emit('close')">Cancel</WorkOSButton>
      <WorkOSButton variant="primary" @click="handleSubmit">{{ editing ? "Update" : "Create" }}</WorkOSButton>
    </template>
  </WorkOSModal>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue"
import WorkOSModal from "../base/WorkOSModal.vue"
import WorkOSButton from "../base/WorkOSButton.vue"

interface WebhookConfig {
	id: string
	name: string
	url: string
	events: string[]
	secret?: string
	active: boolean
	retryPolicy: {
		maxRetries: number
		retryDelay: number
	}
	headers?: Record<string, string>
	organizationId?: string
	createdAt: string
	updatedAt: string
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

const props = defineProps<{
	show: boolean
	editing?: WebhookConfig | null
	availableEvents: string[]
}>()

const emit = defineEmits<{
	close: []
	submit: [data: WebhookFormData]
}>()

const form = reactive<WebhookFormData>({
	name: "",
	url: "",
	events: [],
	secret: "",
	retryPolicy: { maxRetries: 3, retryDelay: 60 },
	headersJson: "",
})

watch(
	() => props.editing,
	(webhook) => {
		if (webhook) {
			form.name = webhook.name
			form.url = webhook.url
			form.events = [...webhook.events]
			form.secret = webhook.secret ?? ""
			form.retryPolicy = { ...webhook.retryPolicy }
			form.headersJson = webhook.headers ? JSON.stringify(webhook.headers, null, 2) : ""
		} else {
			resetForm()
		}
	},
)

const resetForm = () => {
	form.name = ""
	form.url = ""
	form.events = []
	form.secret = ""
	form.retryPolicy = { maxRetries: 3, retryDelay: 60 }
	form.headersJson = ""
}

const handleSubmit = () => {
	emit("submit", { ...form })
}
</script>

<style scoped>
.form-group {
	margin-bottom: 1rem;
}

.form-group label {
	display: block;
	margin-bottom: 0.5rem;
	font-weight: 500;
	color: #374151;
}

.form-group input,
.form-group textarea {
	width: 100%;
	padding: 0.5rem;
	border: 1px solid #d1d5db;
	border-radius: 4px;
	font-size: 1rem;
}

.form-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
}

.events-selector {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 0.5rem;
	max-height: 200px;
	overflow-y: auto;
	border: 1px solid #d1d5db;
	border-radius: 4px;
	padding: 0.5rem;
}

.event-checkbox {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;
}
</style>
