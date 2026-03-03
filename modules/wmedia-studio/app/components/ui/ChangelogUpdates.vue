<script setup lang="ts">
const emit = defineEmits<{ close: [] }>();
const updates = ref([{
	version: "2.5.0",
	date: "2024-01-15",
	features: [
		"AI Music Generator",
		"New Effects Library",
		"Performance Improvements",
	],
	fixes: ["Fixed export bug", "UI improvements"],
}, {
	version: "2.4.0",
	date: "2024-01-01",
	features: ["Batch Processing", "Cloud Sync"],
	fixes: ["Stability fixes"],
}]);
const expandedVersion = ref<string | null>("2.5.0");
</script>
<template>
	<div class="changelog-updates bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] max-h-[80vh] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:file-document" class="w-5 h-5 text-blue-500" />
				Changelog & Updates
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="flex-1 overflow-y-auto space-y-3">
			<div
				v-for="update in updates"
				:key="update.version"
				class="border-l-2 pl-4"
				:class="expandedVersion === update.version
				? 'border-blue-500'
				: 'border-gray-300 dark:border-gray-600'"
			>
				<div
					class="flex items-center gap-2 cursor-pointer"
					@click="expandedVersion = expandedVersion === update.version
					? null
					: update.version"
				>
					<Icon
						:name="expandedVersion === update.version
						? 'mdi:chevron-down'
						: 'mdi:chevron-right'"
						class="w-4 h-4 text-gray-500 dark:text-gray-400"
					/>
					<span class="text-gray-900 dark:text-white font-medium">v{{
							update.version
						}}</span>
					<span class="text-gray-500 text-xs">{{ update.date }}</span>
				</div>
				<div v-if="expandedVersion === update.version" class="mt-2 space-y-2">
					<div v-if="update.features.length > 0">
						<div class="text-green-600 dark:text-green-400 text-xs mb-1 font-medium uppercase">
							New Features
						</div>
						<ul class="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-0.5">
							<li v-for="f in update.features" :key="f">{{ f }}</li>
						</ul>
					</div>
					<div v-if="update.fixes.length > 0">
						<div class="text-blue-600 dark:text-blue-400 text-xs mb-1 font-medium uppercase">
							Bug Fixes
						</div>
						<ul class="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-0.5">
							<li v-for="f in update.fixes" :key="f">{{ f }}</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
			<button class="w-full px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
				Check for Updates
			</button>
		</div>
	</div>
</template>
