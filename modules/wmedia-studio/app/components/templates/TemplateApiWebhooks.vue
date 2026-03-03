<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
	(e: "save", config: ApiConfig): void;
	(e: "close"): void;
}>();

interface ApiConfig {
	apiKey: string;
	webhookUrl: string;
	webhookSecret: string;
	enabledEvents: string[];
	rateLimit: number;
}

const config = ref<ApiConfig>({
	apiKey: "ms_live_xxxxxxxxxxxxxxxx",
	webhookUrl: "",
	webhookSecret: "",
	enabledEvents: ["template.created", "template.used"],
	rateLimit: 1000,
});

const webhookEvents = [
	{ value: "template.created", label: "Template Created" },
	{ value: "template.updated", label: "Template Updated" },
	{ value: "template.used", label: "Template Used" },
	{ value: "template.deleted", label: "Template Deleted" },
	{ value: "batch.completed", label: "Batch Operation Completed" },
];

const regenerateKey = () => {
	config.value.apiKey = "ms_live_"
		+ Math.random().toString(36).substring(2, 15);
};

const showKey = ref(false);
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			@click.self="$emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div>
						<h2 class="text-xl font-bold text-gray-900 dark:text-white">
							API & Webhooks
						</h2>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Integrate templates programmatically
						</p>
					</div>
					<button
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						@click="$emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
					</button>
				</div>

				<div class="flex-1 overflow-y-auto p-6 space-y-6">
					<!-- API Key -->
					<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>API Key</label>
						<div class="flex gap-2">
							<input
								:value="showKey ? config.apiKey : config.apiKey.replace(/./g, '•')"
								readonly
								class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 font-mono text-sm"
							/>
							<button
								class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
								@click="showKey = !showKey"
							>
								<i :class="showKey ? 'i-mdi-eye-off' : 'i-mdi-eye'" />
							</button>
							<button
								class="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200"
								@click="regenerateKey"
							>
								<i class="i-mdi-refresh" />
							</button>
						</div>
						<p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
							Use this key to authenticate API requests. Keep it secure!
						</p>
					</div>

					<!-- Webhook URL -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>Webhook URL</label>
						<input
							v-model="config.webhookUrl"
							type="url"
							placeholder="https://your-app.com/webhooks/media-studio"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
						/>
					</div>

					<!-- Webhook Secret -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>Webhook Secret</label>
						<input
							v-model="config.webhookSecret"
							type="password"
							placeholder="For verifying webhook signatures"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
						/>
					</div>

					<!-- Events -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
						>Subscribe to Events</label>
						<div class="space-y-2">
							<label
								v-for="event in webhookEvents"
								:key="event.value"
								class="flex items-center gap-3"
							>
								<input
									v-model="config.enabledEvents"
									type="checkbox"
									:value="event.value"
									class="w-4 h-4 rounded"
								/>
								<span class="text-sm text-gray-700 dark:text-gray-300">{{
									event.label
								}}</span>
							</label>
						</div>
					</div>

					<!-- Rate Limit -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Rate Limit: {{ config.rateLimit }} requests/hour
						</label>
						<input
							v-model="config.rateLimit"
							type="range"
							min="100"
							max="10000"
							step="100"
							class="w-full"
						/>
					</div>

					<!-- Documentation -->
					<div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
						<h4 class="font-medium text-blue-900 dark:text-blue-300 mb-2">
							API Documentation
						</h4>
						<p class="text-sm text-blue-700 dark:text-blue-400 mb-3">
							Integrate templates into your applications using our REST API.
						</p>
						<button class="text-sm text-blue-600 hover:underline">
							<i class="i-mdi-file-document mr-1" />
							View API Docs
						</button>
					</div>
				</div>

				<div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
					<button
						class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
						@click="$emit('save', config)"
					>
						Save Configuration
					</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>
