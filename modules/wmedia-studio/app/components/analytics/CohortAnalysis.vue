<script setup lang="ts">
interface CohortData {
	cohort: string; // e.g., "2024-01"
	weeks: number[]; // retention percentages for each week
}

const props = defineProps<{
	cohorts: CohortData[];
}>();

const maxWeeks = computed(() =>
	Math.max(...props.cohorts.map(c => c.weeks.length), 0)
);

function getColor(value: number): string {
	if (value >= 60) return "bg-green-500";
	if (value >= 40) return "bg-green-400";
	if (value >= 20) return "bg-yellow-400";
	if (value > 0) return "bg-red-400";
	return "bg-gray-200 dark:bg-gray-700";
}

const weekHeaders = computed(() => {
	return Array.from({ length: maxWeeks.value }, (_, i) => `W${i + 1}`);
});
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
			<i class="i-mdi-account-group text-indigo-500" />
			Retention & Cohort Analysis
		</h3>

		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-gray-200 dark:border-gray-700">
						<th class="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
							Cohort
						</th>
						<th class="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
							Users
						</th>
						<th
							v-for="week in weekHeaders"
							:key="week"
							class="text-center py-2 px-2 font-medium text-gray-700 dark:text-gray-300 w-12"
						>
							{{ week }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="cohort in cohorts"
						:key="cohort.cohort"
						class="border-b border-gray-100 dark:border-gray-800"
					>
						<td class="py-2 px-3 font-medium text-gray-900 dark:text-white">
							{{ cohort.cohort }}
						</td>
						<td class="py-2 px-3 text-right text-gray-600 dark:text-gray-400">
							{{ cohort.weeks[0] || 0 }}
						</td>
						<td
							v-for="(week, index) in cohort.weeks.slice(1)"
							:key="index"
							class="py-2 px-2"
						>
							<div class="flex justify-center">
								<div
									class="w-8 h-8 rounded flex items-center justify-center text-xs font-medium text-white"
									:class="getColor(week)"
									title="{{ week }}% retention"
								>
									{{ Math.round(week) }}
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="flex items-center gap-4 mt-4 text-xs">
			<div class="flex items-center gap-1">
				<div class="w-4 h-4 rounded bg-green-500" />
				<span class="text-gray-600 dark:text-gray-400">60%+</span>
			</div>
			<div class="flex items-center gap-1">
				<div class="w-4 h-4 rounded bg-green-400" />
				<span class="text-gray-600 dark:text-gray-400">40-60%</span>
			</div>
			<div class="flex items-center gap-1">
				<div class="w-4 h-4 rounded bg-yellow-400" />
				<span class="text-gray-600 dark:text-gray-400">20-40%</span>
			</div>
			<div class="flex items-center gap-1">
				<div class="w-4 h-4 rounded bg-red-400" />
				<span class="text-gray-600 dark:text-gray-400">0-20%</span>
			</div>
		</div>
	</div>
</template>
