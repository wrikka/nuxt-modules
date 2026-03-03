<script setup lang="ts">
interface CollaborationData {
	sharedProjects: number;
	collaborators: number;
	comments: number;
	teamContributions: { name: string; contributions: number }[];
}

const props = defineProps<{
	data: CollaborationData;
}>();

const maxContributions = computed(() => {
	if (!props.data.teamContributions.length) return 0;
	return Math.max(...props.data.teamContributions.map(c => c.contributions));
});
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
			Collaboration Analytics
		</h3>

		<div class="grid grid-cols-3 gap-4 mb-6">
			<div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
				<div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
					{{ data.sharedProjects }}
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">
					Shared Projects
				</div>
			</div>
			<div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
				<div class="text-2xl font-bold text-green-600 dark:text-green-400">
					{{ data.collaborators }}
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">
					Collaborators
				</div>
			</div>
			<div class="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
				<div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
					{{ data.comments }}
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">Comments</div>
			</div>
		</div>

		<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
			Team Contributions
		</h4>
		<div class="space-y-3">
			<div
				v-for="member in data.teamContributions"
				:key="member.name"
				class="flex items-center gap-3"
			>
				<div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
					{{ member.name.charAt(0).toUpperCase() }}
				</div>
				<div class="flex-1">
					<div class="flex justify-between mb-1">
						<span class="text-sm font-medium text-gray-900 dark:text-white">{{
							member.name
						}}</span>
						<span class="text-sm text-gray-600 dark:text-gray-400">{{
							member.contributions
						}}</span>
					</div>
					<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<div
							class="h-full bg-blue-500 rounded-full transition-all"
							:style="{ width: `${(member.contributions / maxContributions) * 100}%` }"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
