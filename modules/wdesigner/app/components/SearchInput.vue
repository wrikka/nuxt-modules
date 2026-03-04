<script setup lang="ts">
const props = defineProps<{
	placeholder?: string;
	value: string;
}>();

const emit = defineEmits<{
	update: [value: string];
	search: [value: string];
}>();

const localValue = ref(props.value);

watch(() => props.value, (newVal) => {
	localValue.value = newVal;
});

const debouncedSearch = useDebounceFn((val: string) => {
	emit("search", val);
}, 300);

const handleInput = (e: Event) => {
	const val = (e.target as HTMLInputElement).value;
	localValue.value = val;
	emit("update", val);
	debouncedSearch(val);
};

const clear = () => {
	localValue.value = "";
	emit("update", "");
	emit("search", "");
};
</script>

<template>
	<div class="relative">
		<svg
			class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
		<input
			v-model="localValue"
			type="text"
			:class="[
				'w-full pl-10 pr-10 py-2 text-sm border rounded-lg',
				'focus:outline-none focus:ring-2 focus:ring-blue-500',
				'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
				'text-gray-900 dark:text-white placeholder-gray-400',
			]"
			:placeholder="placeholder || 'Search...'"
			@input="handleInput"
		/>
		<button
			v-if="localValue"
			type="button"
			class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
			@click="clear"
		>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	</div>
</template>
