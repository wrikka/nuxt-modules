<script setup lang="ts">
const isAnalyzing = ref(false);
const stats = ref({
	totalProjects: 42,
	totalAssets: 156,
	storageUsed: "2.4 GB",
	collaborators: 8,
	completedTasks: 127,
});
const period = ref("week");
const periods = ["day", "week", "month", "year"];
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Workspace Stats</h4>
		<div class="flex gap-1 mb-3">
			<button
				v-for="p in periods"
				:key="p"
				:class="[
					'flex-1 py-1 rounded text-xs capitalize',
					period === p ? 'bg-blue-600 text-white' : 'bg-gray-100',
				]"
				@click="period = p"
			>
				{{ p }}
			</button>
		</div>
		<div class="grid grid-cols-2 gap-2 text-xs">
			<div class="p-2 bg-blue-50 rounded">
				<div class="text-blue-600 font-bold text-lg">
					{{ stats.totalProjects }}
				</div>
				<div class="text-gray-500">Projects</div>
			</div>
			<div class="p-2 bg-green-50 rounded">
				<div class="text-green-600 font-bold text-lg">
					{{ stats.totalAssets }}
				</div>
				<div class="text-gray-500">Assets</div>
			</div>
			<div class="p-2 bg-purple-50 rounded">
				<div class="text-purple-600 font-bold text-lg">
					{{ stats.storageUsed }}
				</div>
				<div class="text-gray-500">Storage</div>
			</div>
			<div class="p-2 bg-orange-50 rounded">
				<div class="text-orange-600 font-bold text-lg">
					{{ stats.collaborators }}
				</div>
				<div class="text-gray-500">Team</div>
			</div>
		</div>
	</div>
</template>
