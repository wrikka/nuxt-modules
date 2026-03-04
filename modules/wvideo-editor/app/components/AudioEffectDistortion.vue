<script setup lang="ts">
interface Props {
	params: {
		drive: number;
		tone: number;
		mix: number;
	};
}

defineProps<Props>();
</script>

<template>
	<div class="space-y-3">
		<div>
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Drive</span>
				<span class="text-blue-500">{{ params.drive }}%</span>
			</div>
			<input
				v-model="params.drive"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
		<div>
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Tone</span>
				<span class="text-blue-500">{{ params.tone }}%</span>
			</div>
			<input
				v-model="params.tone"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
		<div>
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Mix</span>
				<span class="text-blue-500">{{ params.mix }}%</span>
			</div>
			<input
				v-model="params.mix"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
	</div>
</template>
