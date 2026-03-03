<script setup lang="ts">
const webhooks = ref([{
	id: "1",
	name: "Project Export",
	url: "https://api.example.com/webhook",
	events: ["export.complete"],
	active: true,
}]);
const apiKey = ref("sk_live_xxxxxxxxxxxx");
const showKey = ref(false);
const endpoints = ref([{
	method: "GET",
	path: "/api/v1/projects",
	description: "List all projects",
}, {
	method: "POST",
	path: "/api/v1/projects",
	description: "Create project",
}]);
const copyKey = () => navigator.clipboard.writeText(apiKey.value);
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
			API & Webhooks
		</h3>

		<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
			<p class="text-sm text-gray-600 mb-2">API Key</p>
			<div class="flex gap-2">
				<input
					:type="showKey ? 'text' : 'password'"
					:value="apiKey"
					readonly
					class="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border rounded font-mono text-sm"
				/>
				<button
					@click="showKey = !showKey"
					class="p-2 hover:bg-gray-200 rounded"
				>
					<Icon :name="showKey ? 'mdi:eye-off' : 'mdi:eye'" class="w-5 h-5" />
				</button>
				<button @click="copyKey" class="p-2 bg-blue-500 text-white rounded">
					<Icon name="mdi:content-copy" class="w-5 h-5" />
				</button>
			</div>
		</div>

		<div class="space-y-2 mb-4">
			<p class="text-sm font-medium">Endpoints</p>
			<div
				v-for="ep in endpoints"
				:key="ep.path"
				class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded"
			>
				<span
					:class="ep.method === 'GET'
					? 'bg-green-100 text-green-700'
					: 'bg-blue-100 text-blue-700'"
					class="px-2 py-0.5 rounded text-xs font-mono"
				>{{ ep.method }}</span>
				<span class="font-mono text-sm">{{ ep.path }}</span>
				<span class="text-xs text-gray-500">{{ ep.description }}</span>
			</div>
		</div>

		<div class="space-y-2">
			<p class="text-sm font-medium">Webhooks</p>
			<div
				v-for="wh in webhooks"
				:key="wh.id"
				class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
			>
				<div class="flex items-center justify-between">
					<span class="font-medium text-sm">{{ wh.name }}</span>
					<button
						:class="wh.active ? 'bg-green-500' : 'bg-gray-300'"
						class="w-10 h-5 rounded-full relative"
					>
						<span
							:class="wh.active ? 'translate-x-5' : 'translate-x-0.5'"
							class="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform"
						/>
					</button>
				</div>
				<p class="text-xs text-gray-500 font-mono mt-1">{{ wh.url }}</p>
				<div class="flex gap-1 mt-2">
					<span
						v-for="e in wh.events"
						:key="e"
						class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
					>{{ e }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
