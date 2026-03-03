<script setup lang="ts">
const emit = defineEmits<{
	(e: "close"): void;
}>();

interface Integration {
	id: string;
	name: string;
	icon: string;
	color: string;
	description: string;
	connected: boolean;
	actions: string[];
}

const integrations = ref<Integration[]>([
	{
		id: "zapier",
		name: "Zapier",
		icon: "i-mdi-lightning-bolt",
		color: "text-orange-500",
		description: "Connect with 5000+ apps via Zapier",
		connected: true,
		actions: [
			"Auto-publish to social",
			"Send email notifications",
			"Create calendar events",
		],
	},
	{
		id: "slack",
		name: "Slack",
		icon: "i-mdi-slack",
		color: "text-purple-500",
		description: "Send template updates to Slack channels",
		connected: false,
		actions: [
			"Share templates",
			"Get approval notifications",
			"Team collaboration",
		],
	},
	{
		id: "notion",
		name: "Notion",
		icon: "i-mdi-notebook",
		color: "text-gray-700 dark:text-gray-300",
		description: "Sync templates with Notion databases",
		connected: false,
		actions: [
			"Create database entries",
			"Track template usage",
			"Documentation",
		],
	},
	{
		id: "trello",
		name: "Trello",
		icon: "i-mdi-trello",
		color: "text-blue-500",
		description: "Create cards for template projects",
		connected: false,
		actions: ["Create cards", "Track progress", "Assign team members"],
	},
	{
		id: "airtable",
		name: "Airtable",
		icon: "i-mdi-table",
		color: "text-teal-500",
		description: "Manage templates in Airtable bases",
		connected: false,
		actions: ["Sync records", "Update templates", "Create views"],
	},
	{
		id: "webhook",
		name: "Custom Webhooks",
		icon: "i-mdi-webhook",
		color: "text-green-500",
		description: "Send events to custom endpoints",
		connected: true,
		actions: ["Template created", "Template updated", "Template published"],
	},
]);

const webhookUrl = ref("https://hooks.yourapp.com/template-events");
const selectedEvents = ref<string[]>(["template.created", "template.updated"]);

const toggleConnection = (id: string) => {
	const integration = integrations.value.find(i => i.id === id);
	if (integration) {
		integration.connected = !integration.connected;
	}
};

const connectedCount = computed(() =>
	integrations.value.filter(i => i.connected).length
);
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			@click.self="emit('close')"
		>
			<div class="absolute inset-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-connection text-indigo-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Integrations
							</h2>
							<p class="text-sm text-gray-500">
								{{ connectedCount }} of {{ integrations.length }} connected
							</p>
						</div>
					</div>
					<button
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						@click="emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
					</button>
				</div>

				<!-- Content -->
				<div class="flex-1 overflow-y-auto p-6">
					<div class="max-w-4xl mx-auto space-y-6">
						<!-- Integration Grid -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div
								v-for="integration in integrations"
								:key="integration.id"
								class="p-4 border rounded-xl transition-all"
								:class="integration.connected
								? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
								: 'border-gray-200 dark:border-gray-700'"
							>
								<div class="flex items-start gap-4">
									<div :class="`w-12 h-12 ${integration.color} bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl shrink-0`">
										<i :class="integration.icon" />
									</div>
									<div class="flex-1">
										<div class="flex items-center justify-between">
											<h3 class="font-semibold text-gray-900 dark:text-white">
												{{ integration.name }}
											</h3>
											<label
												class="relative inline-flex items-center cursor-pointer"
											>
												<input
													type="checkbox"
													:checked="integration.connected"
													class="sr-only peer"
													@change="toggleConnection(integration.id)"
												/>
												<div class="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
											</label>
										</div>
										<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
											{{ integration.description }}
										</p>

										<div v-if="integration.connected" class="mt-3">
											<p class="text-xs text-gray-500 mb-2">
												Available actions:
											</p>
											<div class="flex flex-wrap gap-2">
												<span
													v-for="action in integration.actions"
													:key="action"
													class="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-xs"
												>
													{{ action }}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Webhook Config -->
						<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
							<h3 class="font-medium text-gray-900 dark:text-white mb-4">
								<i class="i-mdi-webhook mr-1" />
								Custom Webhook Configuration
							</h3>
							<div class="space-y-4">
								<div>
									<label
										class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
									>Webhook URL</label>
									<input
										v-model="webhookUrl"
										type="text"
										class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
									/>
								</div>
								<div>
									<label
										class="text-xs text-gray-500 uppercase tracking-wide mb-2 block"
									>Events to Send</label>
									<div class="flex flex-wrap gap-2">
										<label
											v-for='event in [
												"template.created",
												"template.updated",
												"template.deleted",
												"template.published",
											]'
											:key="event"
											class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer"
										>
											<input
												v-model="selectedEvents"
												type="checkbox"
												:value="event"
												class="rounded border-gray-300 text-blue-600"
											/>
											<span class="text-sm">{{
												event.replace("template.", "")
											}}</span>
										</label>
									</div>
								</div>
								<button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
									<i class="i-mdi-send mr-1" />
									Test Webhook
								</button>
							</div>
						</div>

						<!-- API Key -->
						<div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
							<h3 class="font-medium text-blue-900 dark:text-blue-300 mb-3">
								<i class="i-mdi-key mr-1" />
								API Access
							</h3>
							<p class="text-sm text-blue-700 dark:text-blue-400 mb-3">
								Use our API to integrate templates into your own applications.
							</p>
							<div class="flex gap-2">
								<code
									class="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-sm font-mono text-blue-800 dark:text-blue-300"
								>
									ms_api_••••••••••••••••
								</code>
								<button class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
									<i class="i-mdi-refresh" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
