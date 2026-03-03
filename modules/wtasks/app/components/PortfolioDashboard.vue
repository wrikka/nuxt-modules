<script setup lang="ts">
const {
	projects,
	selectedProject,
	fetchProjects,
	getProjectProgress,
	getPortfolioStats,
	getResourceAllocation,
} = usePortfolio()

const tasks = useState<Task[]>("tasks")

const stats = computed(() => getPortfolioStats(tasks.value))

onMounted(() => {
	fetchProjects()
})
</script>

<template>
	<div class="space-y-6">
		<!-- Stats Overview -->
		<div class="grid grid-cols-4 gap-4">
			<div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
				<p class="text-sm text-gray-500">Total Projects</p>
				<p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalProjects }}</p>
			</div>
			<div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
				<p class="text-sm text-gray-500">Active Projects</p>
				<p class="text-2xl font-semibold text-green-600">{{ stats.activeProjects }}</p>
			</div>
			<div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
				<p class="text-sm text-gray-500">Total Tasks</p>
				<p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalTasks }}</p>
			</div>
			<div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
				<p class="text-sm text-gray-500">Avg Progress</p>
				<p class="text-2xl font-semibold text-blue-600">{{ stats.averageProgress }}%</p>
			</div>
		</div>

		<!-- Projects Grid -->
		<div class="grid grid-cols-2 gap-4">
			<div
				v-for="project in projects"
				:key="project.id"
				class="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
			>
				<div class="flex items-start justify-between mb-4">
					<div class="flex items-center gap-3">
						<div
							class="w-10 h-10 rounded-lg"
							:style="{ backgroundColor: project.color }"
						/>
						<div>
							<h3 class="font-semibold text-gray-900 dark:text-white">{{ project.name }}</h3>
							<p class="text-sm text-gray-500">{{ project.status }}</p>
						</div>
					</div>
					<span
						class="px-2 py-1 text-xs font-medium rounded"
						:class="{
							'bg-green-100 text-green-800': project.status === 'active',
							'bg-yellow-100 text-yellow-800': project.status === 'paused',
							'bg-blue-100 text-blue-800': project.status === 'completed',
						}"
					>
						{{ getProjectProgress(project, tasks) }}%
					</span>
				</div>

				<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ project.description }}</p>

				<!-- Progress Bar -->
				<div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
					<div
						class="h-full rounded-full"
						:style="{
							width: getProjectProgress(project, tasks) + '%',
							backgroundColor: project.color
						}"
					/>
				</div>

				<div class="flex items-center justify-between text-sm text-gray-500">
					<span>{{ project.taskIds.length }} tasks</span>
					<span>{{ project.memberIds.length }} members</span>
				</div>

				<!-- Resource Allocation -->
				<div v-if="selectedProject?.id === project.id" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
					<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resource Allocation</h4>
					<div class="space-y-1">
						<div
							v-for="(count, member) in getResourceAllocation(project.id, tasks)"
							:key="member"
							class="flex justify-between text-sm"
						>
							<span class="text-gray-600 dark:text-gray-400">{{ member }}</span>
							<span class="font-medium">{{ count }} tasks</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
