<script setup lang="ts">
const props = defineProps<{
	status: "draft" | "published" | "archived" | "processing";
}>();

const config = {
	draft: {
		label: "Draft",
		class: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
	},
	published: {
		label: "Published",
		class:
			"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
	},
	archived: {
		label: "Archived",
		class:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
	},
	processing: {
		label: "Processing",
		class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
	},
};

const current = computed(() => config[props.status]);
</script>

<template>
	<span
		class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
		:class="current.class"
	>
		{{ current.label }}
	</span>
</template>
