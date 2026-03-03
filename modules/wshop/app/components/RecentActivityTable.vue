<script setup lang="ts">
import type { Activity } from "#shared/types";

defineProps<{
	activities: Activity[];
}>();
</script>

<template>


	<div>
		<h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
			<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
				<thead class="bg-gray-50 dark:bg-gray-700/50">
					<tr>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
						>
							User
						</th>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
						>
							Action
						</th>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
						>
							Time
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
					<tr
						v-for="activity in activities"
						:key="activity.id"
						class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
					>
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
							{{ activity.user }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
							{{ activity.action }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
							{{ activity.time }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>


</template>
