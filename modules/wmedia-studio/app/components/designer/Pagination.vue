<script setup lang="ts">
const props = defineProps<{
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
}>();

const emit = defineEmits<{
	change: [page: number];
}>();

const startItem = computed(() =>
	(props.currentPage - 1) * props.itemsPerPage + 1
);
const endItem = computed(() =>
	Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
);

const pages = computed(() => {
	const result = [];
	for (let i = 1; i <= props.totalPages; i++) {
		if (
			i === 1
			|| i === props.totalPages
			|| (i >= props.currentPage - 1 && i <= props.currentPage + 1)
		) {
			result.push(i);
		} else if (result[result.length - 1] !== "...") {
			result.push("...");
		}
	}
	return result;
});
</script>

<template>
	<div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
		<div class="text-sm text-gray-500 dark:text-gray-400">
			Showing <span class="font-medium">{{ startItem }}</span> to <span
				class="font-medium"
			>{{ endItem }}</span> of <span class="font-medium">{{ totalItems }}</span>
			results
		</div>
		<div class="flex items-center gap-2">
			<button
				:disabled="currentPage === 1"
				class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
				@click="$emit('change', currentPage - 1)"
			>
				Previous
			</button>
			<template v-for="(page, idx) in pages" :key="idx">
				<button
					v-if="page !== '...'"
					:class="[
						'px-3 py-1 text-sm rounded-md',
						page === currentPage
							? 'bg-blue-600 text-white'
							: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
					]"
					@click="$emit('change', page as number)"
				>
					{{ page }}
				</button>
				<span v-else class="px-2 text-gray-400">...</span>
			</template>
			<button
				:disabled="currentPage === totalPages"
				class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
				@click="$emit('change', currentPage + 1)"
			>
				Next
			</button>
		</div>
	</div>
</template>
