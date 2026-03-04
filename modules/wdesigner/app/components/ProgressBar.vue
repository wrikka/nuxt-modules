<script setup lang="ts">
const props = defineProps<{
	progress: number; // 0-100
	label?: string;
}>();
</script>

<template>
	<div
		class="w-full"
		role="progressbar"
		:aria-valuenow="progress"
		aria-valuemin="0"
		aria-valuemax="100"
	>
		<div class="flex justify-between mb-1">
			<span
				v-if="label"
				class="text-sm font-medium text-gray-700 dark:text-gray-300"
			>{{ label }}</span>
			<span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
					progress
				}}%</span>
		</div>
		<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
			<div
				class="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
				:style="{ width: `${progress}%` }"
			>
			</div>
		</div>
	</div>
</template>
