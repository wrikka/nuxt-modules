<script setup lang="ts">
const { projects, fetchProjects } = usePortfolio()

onMounted(() => {
	fetchProjects()
})
</script>

<template>
	<div class="p-6">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Dashboard</h1>
				<p class="text-gray-500">Overview of all your projects</p>
			</div>
			<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
				<Icon name="mdi:plus" class="w-4 h-4 inline mr-1" />
				New Project
			</button>
		</div>

		<PortfolioDashboard />
	</div>
</template>
