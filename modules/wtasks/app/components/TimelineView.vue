<script setup lang="ts">
import { useTimeline } from "../../composables/useTimeline"

const { timelineTasks, timelineHeaders, dateRange, totalDays, zoomIn, zoomOut, resetZoom, isBlocked, getDependencyTypeLabel } = useTimeline()

const emit = defineEmits<{
	(e: "selectTask", taskId: string): void
}>()

const statusColors: Record<string, string> = {
	Backlog: "bg-slate-400",
	"In Design": "bg-indigo-400",
	"In Progress": "bg-amber-400",
	"In Review": "bg-blue-400",
	Done: "bg-emerald-400",
	Cancelled: "bg-red-400",
}

const statusOrder = ["Backlog", "In Design", "In Progress", "In Review", "Done", "Cancelled"]
</script>

<template>
	<div class="flex flex-col h-full">
		<!-- Header -->
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-2">
				<h2 class="text-xl font-semibold">
					Timeline / Gantt
				</h2>
				<span class="text-sm text-gray-500">
					{{ dateRange.start.toLocaleDateString() }} - {{ dateRange.end.toLocaleDateString() }}
				</span>
			</div>

			<div class="flex items-center gap-2">
				<button
					class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					title="Zoom out"
					@click="zoomOut"
				>
					<div class="i-mdi-magnify-minus w-5 h-5" />
				</button>
				<button
					class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					title="Reset zoom"
					@click="resetZoom"
				>
					<div class="i-mdi-magnify w-5 h-5" />
				</button>
				<button
					class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					title="Zoom in"
					@click="zoomIn"
				>
					<div class="i-mdi-magnify-plus w-5 h-5" />
				</button>
			</div>
		</div>

		<!-- Timeline container -->
		<div class="flex-1 overflow-auto border border-gray-200 rounded-lg">
			<div class="min-w-max">
				<!-- Timeline headers -->
				<div class="flex sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
					<div class="w-64 px-4 py-2 font-medium text-sm border-r border-gray-200">
						Task
					</div>
					<div class="flex">
						<div
							v-for="header in timelineHeaders"
							:key="header.date.toISOString()"
							class="w-10 px-1 py-2 text-center text-xs border-r border-gray-100"
							:class="[
								header.isWeekend ? 'bg-gray-100' : '',
								new Date().toDateString() === header.date.toDateString() ? 'bg-blue-50 font-semibold' : '',
							]"
						>
							<div class="text-gray-500">{{ header.date.toLocaleDateString('en', { weekday: 'narrow' }) }}</div>
							<div :class="new Date().toDateString() === header.date.toDateString() ? 'text-blue-600' : 'text-gray-700'">
								{{ header.label }}
							</div>
						</div>
					</div>
				</div>

				<!-- Task rows by status -->
				<div
					v-for="status in statusOrder"
					:key="status"
					class="border-b border-gray-100"
				>
					<!-- Status header -->
					<div class="bg-gray-50 px-4 py-1 text-sm font-medium text-gray-600 sticky left-0">
						{{ status }}
					</div>

					<!-- Tasks in this status -->
					<div
						v-for="task in timelineTasks.filter(t => t.status === status)"
						:key="task.id"
						class="flex hover:bg-gray-50 transition-colors group"
					>
						<!-- Task name column -->
						<div class="w-64 px-4 py-2 border-r border-gray-200 flex items-center gap-2 sticky left-0 bg-white group-hover:bg-gray-50">
							<div
								class="w-2 h-2 rounded-full"
								:class="statusColors[task.status]"
							/>
							<span class="text-sm truncate" :class="isBlocked(task.id) ? 'text-gray-400' : ''">
								{{ task.title }}
							</span>
							<div
								v-if="isBlocked(task.id)"
								class="i-mdi-lock w-4 h-4 text-gray-400"
								title="Blocked by dependencies"
							/>
						</div>

						<!-- Timeline bar area -->
						<div class="flex relative" :style="{ width: `${totalDays * 40}px` }">
							<!-- Task bar -->
							<div
								class="absolute h-6 rounded cursor-pointer hover:opacity-80 transition-all flex items-center px-2 text-xs text-white truncate"
								:class="statusColors[task.status]"
								:style="{
									left: `${task.startPosition}%`,
									width: `${Math.max(2, (task.duration / totalDays) * 100)}%`,
									top: `${task.overlapIndex * 28 + 4}px`,
								}"
								@click="emit('selectTask', task.id)"
							>
								{{ task.title }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Legend -->
		<div class="flex items-center gap-4 mt-4 px-4 py-2 bg-gray-50 rounded-lg">
			<span class="text-sm text-gray-600">Status:</span>
			<div
				v-for="[status, color] in Object.entries(statusColors)"
				:key="status"
				class="flex items-center gap-1"
			>
				<div class="w-3 h-3 rounded" :class="color" />
				<span class="text-xs text-gray-600">{{ status }}</span>
			</div>
		</div>
	</div>
</template>
