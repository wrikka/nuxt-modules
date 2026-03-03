<script setup lang="ts">
interface ComparisonData {
	current: { label: string; value: number }[];
	previous: { label: string; value: number }[];
}

const props = defineProps<{
	data: ComparisonData;
	title?: string;
}>();

const comparisons = computed(() => {
	return props.data.current.map((curr, i) => {
		const prev = props.data.previous[i];
		const change = prev ? ((curr.value - prev.value) / prev.value) * 100 : 0;
		return {
			label: curr.label,
			current: curr.value,
			previous: prev?.value || 0,
			change: Math.round(change * 10) / 10,
			positive: change >= 0,
		};
	});
});
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
			{{ title || "Comparison Mode" }}
		</h3>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-gray-200 dark:border-gray-700">
						<th class="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
							Metric
						</th>
						<th class="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
							Current
						</th>
						<th class="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
							Previous
						</th>
						<th class="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
							Change
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="item in comparisons"
						:key="item.label"
						class="border-b border-gray-100 dark:border-gray-800"
					>
						<td class="py-2 px-3 font-medium text-gray-900 dark:text-white">
							{{ item.label }}
						</td>
						<td class="py-2 px-3 text-right text-gray-900 dark:text-white">
							{{ item.current }}
						</td>
						<td class="py-2 px-3 text-right text-gray-600 dark:text-gray-400">
							{{ item.previous }}
						</td>
						<td class="py-2 px-3 text-right">
							<span
								class="font-medium"
								:class="item.positive
								? 'text-green-600 dark:text-green-400'
								: 'text-red-600 dark:text-red-400'"
							>
								{{ item.positive ? "+" : "" }}{{ item.change }}%
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
