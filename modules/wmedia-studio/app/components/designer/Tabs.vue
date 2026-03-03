<script setup lang="ts">
const props = defineProps<{
	tabs: { id: string; label: string; badge?: number }[];
	activeTab: string;
}>();

const emit = defineEmits<{
	change: [tabId: string];
}>();
</script>

<template>
	<div class="border-b border-gray-200 dark:border-gray-700">
		<nav class="flex -mb-px" aria-label="Tabs">
			<button
				v-for="tab in tabs"
				:key="tab.id"
				:class="[
					'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
					activeTab === tab.id
						? 'border-blue-500 text-blue-600 dark:text-blue-400'
						: 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300',
				]"
				@click="$emit('change', tab.id)"
				role="tab"
				:aria-selected="activeTab === tab.id"
			>
				{{ tab.label }}
				<span
					v-if="tab.badge"
					class="ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full"
				>
					{{ tab.badge }}
				</span>
			</button>
		</nav>
	</div>
</template>
