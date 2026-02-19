<script setup lang="ts">
const {
	ganttTasks,
	viewStartDate,
	viewEndDate,
	zoomLevel,
	convertToGantt,
	getViewDays,
	getTaskBarStyle,
	panView,
	zoom,
} = useGanttChart()

const props = defineProps<{
	tasks: Task[]
}>()

const days = computed(() => getViewDays())

onMounted(() => {
	convertToGantt(props.tasks)
})

watch(() => props.tasks, (newTasks) => {
	convertToGantt(newTasks)
}, { deep: true })
</script>

<template>
	<div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
		<!-- Toolbar -->
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-2">
				<button
					class="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg"
					@click="panView('left')"
				>
					<Icon name="mdi:chevron-left" class="w-5 h-5" />
				</button>
				<button
					class="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg"
					@click="panView('right')"
				>
					<Icon name="mdi:chevron-right" class="w-5 h-5" />
				</button>
				<span class="text-sm text-gray-600 dark:text-gray-400">
					{{ viewStartDate.toLocaleDateString() }} - {{ viewEndDate.toLocaleDateString() }}
				</span>
			</div>
			<div class="flex items-center gap-2">
				<button
					class="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg"
					@click="zoom('out')"
				>
					<Icon name="mdi:magnify-minus" class="w-5 h-5" />
				</button>
				<button
					class="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg"
					@click="zoom('in')"
				>
					<Icon name="mdi:magnify-plus" class="w-5 h-5" />
				</button>
			</div>
		</div>

		<!-- Gantt Chart -->
		<div class="overflow-x-auto">
			<div class="min-w-max">
				<!-- Header Row -->
				<div class="flex border-b border-gray-200 dark:border-gray-700">
					<div class="w-48 flex-shrink-0 p-2 font-medium text-sm text-gray-700 dark:text-gray-300">
						Task
					</div>
					<div class="flex">
						<div
							v-for="day in days"
							:key="day.toISOString()"
							class="w-12 flex-shrink-0 p-2 text-center text-xs border-r border-gray-100 dark:border-gray-800"
							:class="{
								'bg-blue-50 dark:bg-blue-900/20': day.getDay() === 0 || day.getDay() === 6
							}"
						>
							<div class="font-medium">{{ day.getDate() }}</div>
							<div class="text-gray-400">{{ day.toLocaleDateString('en', { weekday: 'narrow' }) }}</div>
						</div>
					</div>
				</div>

				<!-- Task Rows -->
				<div
					v-for="ganttTask in ganttTasks"
					:key="ganttTask.taskId"
					class="flex border-b border-gray-100 dark:border-gray-800"
				>
					<div class="w-48 flex-shrink-0 p-2 text-sm text-gray-900 dark:text-white truncate">
						{{ tasks.find(t => t.id === ganttTask.taskId)?.title || 'Unknown' }}
					</div>
					<div class="relative flex" style="height: 40px;">
						<!-- Gantt Bar -->
						<div
							class="absolute h-6 rounded-md cursor-move"
							:style="{
								...getTaskBarStyle(ganttTask),
								backgroundColor: ganttTask.progress === 100 ? '#34d399' : '#60a5fa',
								top: '8px',
								height: '24px'
							}"
						>
							<div
								class="h-full bg-black/20 rounded-l-md"
								:style="{ width: ganttTask.progress + '%' }"
							/>
							<span class="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
								{{ ganttTask.progress }}%
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
