<script setup lang="ts">
const props = defineProps<{
	title: string;
	data: { label: string; value: number; color?: string }[];
	type: "bar" | "line" | "pie";
}>();

const maxValue = computed(() => Math.max(...props.data.map(d => d.value)));
const totalValue = computed(() =>
	props.data.reduce((sum, d) => sum + d.value, 0)
);

const defaultColors = [
	"bg-blue-500",
	"bg-green-500",
	"bg-purple-500",
	"bg-yellow-500",
	"bg-pink-500",
	"bg-red-500",
];
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
		<h3 class="font-semibold text-gray-900 dark:text-white mb-4">
			{{ title }}
		</h3>

		<!-- Bar Chart -->
		<div v-if="type === 'bar'" class="space-y-2">
			<div
				v-for="(item, i) in data"
				:key="item.label"
				class="flex items-center gap-2"
			>
				<span class="text-xs text-gray-500 w-20 truncate">{{
					item.label
				}}</span>
				<div class="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
					<div
						:class="[
							'h-full rounded-full transition-all duration-500',
							item.color || defaultColors[i % defaultColors.length],
						]"
						:style="{ width: `${(item.value / maxValue) * 100}%` }"
					/>
				</div>
				<span
					class="text-xs font-medium text-gray-700 dark:text-gray-300 w-10 text-right"
				>{{ item.value }}</span>
			</div>
		</div>

		<!-- Line Chart (simplified as bar for now) -->
		<div v-else-if="type === 'line'" class="h-32 flex items-end gap-1">
			<div
				v-for="(item, i) in data"
				:key="item.label"
				class="flex-1 flex flex-col items-center gap-1"
			>
				<div
					:class="[
						'w-full rounded-t transition-all duration-500',
						item.color || defaultColors[i % defaultColors.length],
					]"
					:style="{ height: `${(item.value / maxValue) * 100}%` }"
				/>
				<span class="text-xs text-gray-500">{{ item.label }}</span>
			</div>
		</div>

		<!-- Pie Chart (simplified as horizontal bars) -->
		<div v-else class="space-y-2">
			<div
				v-for="(item, i) in data"
				:key="item.label"
				class="flex items-center gap-2"
			>
				<div
					:class="[
						'w-3 h-3 rounded-full',
						item.color || defaultColors[i % defaultColors.length],
					]"
				/>
				<span class="text-sm text-gray-700 dark:text-gray-300 flex-1">{{
					item.label
				}}</span>
				<span class="text-sm font-medium text-gray-900 dark:text-white">{{
						Math.round((item.value / totalValue) * 100)
					}}%</span>
			</div>
		</div>
	</div>
</template>
