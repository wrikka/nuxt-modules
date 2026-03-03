<script setup lang="ts">
interface Props {
	max: number;
	value: number;
	label?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	change: [value: number];
}>();

const percentage = computed(() => (props.value / props.max) * 100);

const handleClick = (e: MouseEvent) => {
	const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
	const x = e.clientX - rect.left;
	const newValue = Math.round((x / rect.width) * props.max);
	emit("change", Math.max(0, Math.min(props.max, newValue)));
};
</script>

<template>
	<div class="w-full">
		<div v-if="label" class="flex justify-between mb-1">
			<span class="text-sm text-gray-700 dark:text-gray-300">{{ label }}</span>
			<span class="text-sm text-gray-500">{{ value }}/{{ max }}</span>
		</div>
		<div
			class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
			@click="handleClick"
		>
			<div
				class="h-full bg-blue-600 rounded-full transition-all duration-150"
				:style="{ width: `${percentage}%` }"
			/>
		</div>
	</div>
</template>
