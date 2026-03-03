<script setup lang="ts">
interface Props {
	params: {
		time: number;
		feedback: number;
		mix: number;
	};
}

defineProps<Props>();
</script>

<template>
	<div class="space-y-3">
		<div>
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Delay Time</span>
				<span class="text-blue-500">{{ params.time }}ms</span>
			</div>
			<input
				v-model="params.time"
				type="range"
				min="10"
				max="2000"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
		<div>
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Feedback</span>
				<span class="text-blue-500">{{ params.feedback }}%</span>
			</div>
			<input
				v-model="params.feedback"
				type="range"
				min="0"
				max="95"
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
