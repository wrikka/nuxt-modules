<script setup lang="ts">
import { useCalendar } from "../../composables/useCalendar"

const { calendarWeeks, monthName, previousMonth, nextMonth, goToToday, overdueTasks, formatDate } = useCalendar()

const emit = defineEmits<{
	(e: "selectTask", taskId: string): void
	(e: "createTask", date: Date): void
}>()

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const statusColors: Record<string, string> = {
	Backlog: "bg-slate-400",
	"In Design": "bg-indigo-400",
	"In Progress": "bg-amber-400",
	"In Review": "bg-blue-400",
	Done: "bg-emerald-400",
	Cancelled: "bg-red-400",
}

const priorityClasses: Record<string, string> = {
	Urgent: "border-l-4 border-red-500",
	High: "border-l-4 border-orange-500",
	Medium: "border-l-4 border-yellow-500",
	Low: "border-l-4 border-green-500",
	None: "border-l-4 border-slate-300",
}
</script>

<template>
	<div class="flex flex-col h-full">
		<!-- Header -->
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-2">
				<button
					class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
					@click="goToToday"
				>
					Today
				</button>
				<div class="flex items-center gap-1">
					<button
						class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
						@click="previousMonth"
					>
						<div class="i-mdi-chevron-left w-5 h-5" />
					</button>
					<button
						class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
						@click="nextMonth"
					>
						<div class="i-mdi-chevron-right w-5 h-5" />
					</button>
				</div>
				<h2 class="text-xl font-semibold ml-2">
					{{ monthName }}
				</h2>
			</div>

			<!-- Overdue indicator -->
			<div
				v-if="overdueTasks.length > 0"
				class="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm"
			>
				<div class="i-mdi-alert-circle w-4 h-4" />
				<span>{{ overdueTasks.length }} overdue</span>
			</div>
		</div>

		<!-- Week day headers -->
		<div class="grid grid-cols-7 gap-1 mb-2">
			<div
				v-for="day in weekDays"
				:key="day"
				class="text-center text-sm font-medium text-gray-500 py-2"
			>
				{{ day }}
			</div>
		</div>

		<!-- Calendar grid -->
		<div class="flex-1 grid grid-cols-7 gap-1">
			<div
				v-for="(week, weekIndex) in calendarWeeks"
				:key="weekIndex"
				class="contents"
			>
				<div
					v-for="day in week.days"
					:key="day.date.toISOString()"
					class="min-h-[120px] border border-gray-200 rounded-lg p-2 transition-colors"
					:class="[
						day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
						day.isToday ? 'ring-2 ring-blue-500' : '',
						day.date.getDay() === 0 || day.date.getDay() === 6 ? 'bg-gray-50/50' : '',
					]"
				>
					<!-- Day number -->
					<div class="flex items-center justify-between mb-1">
						<span
							class="text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full"
							:class="day.isToday ? 'bg-blue-500 text-white' : 'text-gray-700'"
						>
							{{ day.date.getDate() }}
						</span>
						<button
							v-if="day.isCurrentMonth"
							class="opacity-0 hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
							@click="emit('createTask', day.date)"
						>
							<div class="i-mdi-plus w-4 h-4 text-gray-400" />
						</button>
					</div>

					<!-- Tasks for the day -->
					<div class="space-y-1">
						<div
							v-for="task in day.tasks.slice(0, 3)"
							:key="task.id"
							class="text-xs p-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity truncate"
							:class="[
								statusColors[task.status] || 'bg-gray-300',
								priorityClasses[task.priority],
								'text-white',
							]"
							@click="emit('selectTask', task.id)"
						>
							{{ task.title }}
						</div>
						<div
							v-if="day.tasks.length > 3"
							class="text-xs text-gray-500 px-1.5 py-0.5"
						>
							+{{ day.tasks.length - 3 }} more
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
