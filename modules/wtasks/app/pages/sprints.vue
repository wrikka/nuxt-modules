<script setup lang="ts">
const { sprints, fetchSprints } = useSprintPlanning()

onMounted(() => {
	fetchSprints()
})
</script>

<template>
	<div class="p-6">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Sprints</h1>
				<p class="text-gray-500">Manage your sprint planning and backlog</p>
			</div>
		</div>

		<div class="grid grid-cols-3 gap-6">
			<!-- Sprint Board -->
			<div class="col-span-2">
				<SprintBoard />
			</div>

			<!-- Team Panel -->
			<div>
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team</h2>
				<TeamPanel />
			</div>
		</div>
	</div>
</template>
