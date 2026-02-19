<script setup lang="ts">
const {
	sprints,
	currentSprint,
	burndownData,
	fetchSprints,
	createSprint,
	startSprint,
	completeSprint,
	addTaskToSprint,
	fetchBurndownData,
	getSprintProgress,
	getRemainingDays,
} = useSprintPlanning()

const showCreateModal = ref(false)
const newSprintName = ref("")
const newSprintGoal = ref("")

const handleCreateSprint = async () => {
	const startDate = new Date()
	const endDate = new Date()
	endDate.setDate(endDate.getDate() + 14)

	await createSprint({
		name: newSprintName.value,
		goal: newSprintGoal.value,
		status: "planning",
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
		taskIds: [],
		capacity: 40,
	})

	showCreateModal.value = false
	newSprintName.value = ""
	newSprintGoal.value = ""
}

onMounted(() => {
	fetchSprints()
})
</script>

<template>
	<div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Sprints</h2>
			<button
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				@click="showCreateModal = true"
			>
				<Icon name="mdi:plus" class="w-4 h-4 inline mr-1" />
				New Sprint
			</button>
		</div>

		<!-- Current Sprint -->
		<div v-if="currentSprint" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
			<div class="flex items-center justify-between">
				<div>
					<div class="flex items-center gap-2">
						<span class="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded">
							Active
						</span>
						<h3 class="font-semibold text-gray-900 dark:text-white">{{ currentSprint.name }}</h3>
					</div>
					<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ currentSprint.goal }}</p>
					<p class="text-xs text-gray-500 mt-2">
						{{ getRemainingDays(currentSprint) }} days remaining •
						{{ currentSprint.taskIds.length }} tasks •
						{{ getSprintProgress(currentSprint) }}% complete
					</p>
				</div>
				<button
					class="px-3 py-1.5 text-sm border border-green-600 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40"
					@click="completeSprint(currentSprint.id)"
				>
					Complete Sprint
				</button>
			</div>
		</div>

		<!-- Sprint List -->
		<div class="space-y-3">
			<div
				v-for="sprint in sprints"
				:key="sprint.id"
				class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
			>
				<div class="flex items-center gap-3">
					<span
						class="px-2 py-0.5 text-xs font-medium rounded"
						:class="{
							'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200': sprint.status === 'active',
							'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200': sprint.status === 'planning',
							'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200': sprint.status === 'completed',
						}"
					>
						{{ sprint.status }}
					</span>
					<div>
						<p class="font-medium text-gray-900 dark:text-white">{{ sprint.name }}</p>
						<p class="text-sm text-gray-500">
							{{ new Date(sprint.startDate).toLocaleDateString() }} -
							{{ new Date(sprint.endDate).toLocaleDateString() }}
						</p>
					</div>
				</div>
				<button
					v-if="sprint.status === 'planning'"
					class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					@click="startSprint(sprint.id)"
				>
					Start
				</button>
			</div>
		</div>

		<!-- Create Sprint Modal -->
		<BaseModal v-if="showCreateModal" title="Create New Sprint" @close="showCreateModal = false">
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sprint Name</label>
					<input
						v-model="newSprintName"
						type="text"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
						placeholder="e.g., Sprint 1"
					>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sprint Goal</label>
					<textarea
						v-model="newSprintGoal"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
						rows="3"
						placeholder="What do we want to achieve in this sprint?"
					/>
				</div>
				<div class="flex justify-end gap-3">
					<button
						class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
						@click="showCreateModal = false"
					>
						Cancel
					</button>
					<button
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
						:disabled="!newSprintName"
						@click="handleCreateSprint"
					>
						Create
					</button>
				</div>
			</div>
		</BaseModal>
	</div>
</template>
