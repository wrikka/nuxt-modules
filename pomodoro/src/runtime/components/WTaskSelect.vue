<script setup lang="ts">
import type { Task } from "#pomodoro/types"

const props = defineProps<{
	tasks: Task[]
	activeTaskId?: string
}>()

const emit = defineEmits<{
	select: [taskId: string]
}>()

function selectTask(taskId: string) {
	emit("select", taskId)
}
</script>

<template>
	<div class="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
		<h3 class="mb-4 text-lg font-semibold">Select Task</h3>

		<div class="space-y-2">
			<button
				v-for="task in tasks"
				:key="task.id"
				class="w-full rounded-lg p-3 text-left transition-all"
				:class="activeTaskId === task.id
					? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
					: 'hover:bg-gray-100 dark:hover:bg-gray-700'"
				@click="selectTask(task.id)"
			>
				<div class="flex items-center justify-between">
					<span class="font-medium">{{ task.name }}</span>
					<div class="flex items-center gap-2 text-sm">
						<span class="opacity-75">
							{{ task.pomodorosCompleted }}/{{ task.pomodorosEstimated }}
						</span>
						<div class="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
							<div
								class="h-full rounded-full bg-red-500"
								:style="{ width: `${(task.pomodorosCompleted / task.pomodorosEstimated) * 100}%` }"
							/>
						</div>
					</div>
				</div>
			</button>

			<div v-if="tasks.length === 0" class="py-8 text-center text-gray-500">
				No tasks available
			</div>
		</div>
	</div>
</template>
