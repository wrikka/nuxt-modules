<script setup lang="ts">
export type SortOption =
	| "name-asc"
	| "name-desc"
	| "date-asc"
	| "date-desc"
	| "size-asc"
	| "size-desc";

const props = defineProps<{
	sort: SortOption;
}>();

const emit = defineEmits<{
	change: [sort: SortOption];
}>();

const sortOptions = [
	{ value: "name-asc" as SortOption, label: "Name (A-Z)" },
	{ value: "name-desc" as SortOption, label: "Name (Z-A)" },
	{ value: "date-asc" as SortOption, label: "Date (Oldest)" },
	{ value: "date-desc" as SortOption, label: "Date (Newest)" },
	{ value: "size-asc" as SortOption, label: "Size (Smallest)" },
	{ value: "size-desc" as SortOption, label: "Size (Largest)" },
];
</script>

<template>
	<div class="sort-dropdown">
		<select
			:value="props.sort"
			@change="emit('change', ($event.target as HTMLSelectElement).value as SortOption)"
			class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
		>
			<option
				v-for="option in sortOptions"
				:key="option.value"
				:value="option.value"
			>
				{{ option.label }}
			</option>
		</select>
	</div>
</template>
