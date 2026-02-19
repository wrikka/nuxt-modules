<script setup lang="ts">
import { useWebhooks } from "../../composables/useWebhooks"
import type { WebhookProvider } from "../../../shared/types/integration"

const { webhooks, isLoading, fetchWebhooks, createWebhook, deleteWebhook, testWebhook, getProviderIcon, getProviderColor } = useWebhooks()

const showAddModal = ref(false)
const newWebhook = ref({
	provider: "slack" as WebhookProvider,
	name: "",
	url: "",
	events: ["task.created", "task.completed"],
	isActive: true,
})

const availableEvents = [
	{ value: "task.created", label: "Task Created" },
	{ value: "task.updated", label: "Task Updated" },
	{ value: "task.deleted", label: "Task Deleted" },
	{ value: "task.completed", label: "Task Completed" },
	{ value: "comment.created", label: "Comment Created" },
	{ value: "comment.updated", label: "Comment Updated" },
]

async function addWebhook() {
	await createWebhook(newWebhook.value)
	showAddModal.value = false
	newWebhook.value = {
		provider: "slack",
		name: "",
		url: "",
		events: ["task.created", "task.completed"],
		isActive: true,
	}
}

onMounted(() => {
	fetchWebhooks()
})
</script>

<template>
	<div class="webhook-manager">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold">Webhook Notifications</h3>
			<button
				class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
				@click="showAddModal = true"
			>
				Add Webhook
			</button>
		</div>

		<div v-if="isLoading" class="text-center py-8">
			<span class="i-lucide-loader-2 animate-spin" />
			Loading...
		</div>

		<div v-else-if="webhooks.length === 0" class="text-gray-500 text-center py-8">
			No webhooks configured
		</div>

		<div v-else class="space-y-3">
			<div
				v-for="webhook in webhooks"
				:key="webhook.id"
				class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
			>
				<div class="flex items-center gap-3">
					<span
						class="w-10 h-10 rounded-full flex items-center justify-center text-white"
						:style="{ backgroundColor: getProviderColor(webhook.provider) }"
					>
						<span :class="getProviderIcon(webhook.provider)" />
					</span>
					<div>
						<p class="font-medium">{{ webhook.name }}</p>
						<p class="text-sm text-gray-500">{{ webhook.events.length }} events</p>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<span
						class="px-2 py-1 text-xs rounded"
						:class="webhook.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
					>
						{{ webhook.isActive ? "Active" : "Inactive" }}
					</span>
					<button
						class="p-2 text-gray-500 hover:text-blue-500"
						@click="testWebhook(webhook.id)"
						title="Test webhook"
					>
						<span class="i-lucide-send" />
					</button>
					<button
						class="p-2 text-gray-500 hover:text-red-500"
						@click="deleteWebhook(webhook.id)"
						title="Delete webhook"
					>
						<span class="i-lucide-trash-2" />
					</button>
				</div>
			</div>
		</div>

		<!-- Add Webhook Modal -->
		<div
			v-if="showAddModal"
			class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			@click.self="showAddModal = false"
		>
			<div class="bg-white rounded-lg p-6 w-full max-w-md">
				<h3 class="text-lg font-semibold mb-4">Add Webhook</h3>

				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-1">Provider</label>
						<div class="flex gap-2">
							<button
								class="flex-1 p-3 rounded border flex items-center justify-center gap-2"
								:class="newWebhook.provider === 'slack' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
								@click="newWebhook.provider = 'slack'"
							>
								<span class="i-simple-icons-slack" />
								Slack
							</button>
							<button
								class="flex-1 p-3 rounded border flex items-center justify-center gap-2"
								:class="newWebhook.provider === 'discord' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
								@click="newWebhook.provider = 'discord'"
							>
								<span class="i-simple-icons-discord" />
								Discord
							</button>
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium mb-1">Name</label>
						<input
							v-model="newWebhook.name"
							type="text"
							class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="e.g., Development Channel"
						>
					</div>

					<div>
						<label class="block text-sm font-medium mb-1">Webhook URL</label>
						<input
							v-model="newWebhook.url"
							type="url"
							class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="https://hooks.slack.com/services/..."
						>
					</div>

					<div>
						<label class="block text-sm font-medium mb-2">Events</label>
						<div class="space-y-2">
							<label
								v-for="event in availableEvents"
								:key="event.value"
								class="flex items-center gap-2 cursor-pointer"
							>
								<input
									v-model="newWebhook.events"
									type="checkbox"
									:value="event.value"
									class="rounded"
								>
								<span class="text-sm">{{ event.label }}</span>
							</label>
						</div>
					</div>

					<div class="flex items-center gap-2">
						<input
							id="isActive"
							v-model="newWebhook.isActive"
							type="checkbox"
							class="rounded"
						>
						<label for="isActive" class="text-sm">Active</label>
					</div>
				</div>

				<div class="flex justify-end gap-2 mt-6">
					<button
						class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
						@click="showAddModal = false"
					>
						Cancel
					</button>
					<button
						class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						:disabled="!newWebhook.name || !newWebhook.url"
						@click="addWebhook"
					>
						Add Webhook
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
