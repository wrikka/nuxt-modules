<script setup lang="ts">
const props = defineProps<{
	view: "grid" | "list";
}>();

const emit = defineEmits<{
	change: [view: "grid" | "list"];
}>();
</script>

<template>
	<div class="view-toggle inline-flex items-center rounded-md border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
		<button
			@click="emit('change', 'grid')"
			:class="view === 'grid'
			? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
			: 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'"
			class="rounded-l-md px-3 py-1.5"
			title="Grid View"
		>
			<i class="i-mdi-view-grid" />
		</button>
		<button
			@click="emit('change', 'list')"
			:class="view === 'list'
			? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
			: 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'"
			class="rounded-r-md px-3 py-1.5"
			title="List View"
		>
			<i class="i-mdi-view-list" />
		</button>
	</div>
</template>
