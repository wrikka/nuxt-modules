<script setup lang="ts">
const props = defineProps<{
	title: string;
	value: string | number;
	change?: number;
	icon: string;
	color: "blue" | "green" | "purple" | "red" | "yellow";
}>();

const colorClasses = {
	blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
	green: "bg-green-50 dark:bg-green-900/20 text-green-600",
	purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600",
	red: "bg-red-50 dark:bg-red-900/20 text-red-600",
	yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600",
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
		<div class="flex items-start justify-between">
			<div>
				<p class="text-sm text-gray-500 dark:text-gray-400">{{ title }}</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
					{{ value }}
				</p>
				<p
					v-if="change !== undefined"
					:class="[
						'text-sm mt-1 flex items-center gap-1',
						change >= 0 ? 'text-green-500' : 'text-red-500',
					]"
				>
					<Icon
						:name="change >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'"
						class="w-4 h-4"
					/>
					{{ change >= 0 ? "+" : "" }}{{ change }}%
				</p>
			</div>
			<div
				:class="[
					'w-12 h-12 rounded-xl flex items-center justify-center',
					colorClasses[color],
				]"
			>
				<Icon :name="icon" class="w-6 h-6" />
			</div>
		</div>
	</div>
</template>
