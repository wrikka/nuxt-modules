<script setup lang="ts">
defineProps<{
	title: string;
	value: string | number;
	icon: string;
	iconBg: string;
	iconColor: string;
	change?: string;
	changeIcon?: string;
	changeColor?: string;
	changeText?: string;
}>();
</script>

<template>
	<div class="analytics-card rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm font-medium text-gray-500 dark:text-gray-400">
					{{ title }}
				</p>
				<p class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
					{{ value }}
				</p>
			</div>
			<div :class="iconBg" class="rounded-full p-3">
				<i :class="[icon, 'text-2xl', iconColor]" />
			</div>
		</div>
		<div v-if="change" class="mt-4 flex items-center text-sm">
			<i :class="[changeIcon, 'mr-1', changeColor]" />
			<span :class="changeColor">{{ change }}</span>
			<span class="ml-2 text-gray-500 dark:text-gray-400">{{
				changeText
			}}</span>
		</div>
	</div>
</template>
