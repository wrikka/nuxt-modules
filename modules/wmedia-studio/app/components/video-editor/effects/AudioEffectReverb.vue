<script setup lang="ts">
interface Props {
	params: {
		roomSize: number;
		damping: number;
		wetLevel: number;
		preDelay: number;
	};
}

defineProps<Props>();
</script>

<template>
	<div class="space-y-3">
		<div>
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Room Size</span>
				<span class="text-blue-500">{{ params.roomSize }}%</span>
			</div>
			<input
				v-model="params.roomSize"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
		<div>
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Damping</span>
				<span class="text-blue-500">{{ params.damping }}%</span>
			</div>
			<input
				v-model="params.damping"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
		<div>
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Wet Level</span>
				<span class="text-blue-500">{{ params.wetLevel }}%</span>
			</div>
			<input
				v-model="params.wetLevel"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
		<div>
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Pre-delay</span>
				<span class="text-blue-500">{{ params.preDelay }}ms</span>
			</div>
			<input
				v-model="params.preDelay"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
	</div>
</template>
