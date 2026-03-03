<script setup lang="ts">
import { useAnalytics } from "../../composables/useAnalytics"

const { analytics, statusChartData, priorityChartData, productivityMetrics, completionTrend, velocityData, formatDuration } = useAnalytics()

const statusColors: Record<string, string> = {
	Backlog: "#94a3b8",
	"In Design": "#818cf8",
	"In Progress": "#fbbf24",
	"In Review": "#60a5fa",
	Done: "#34d399",
	Cancelled: "#f87171",
}

const priorityColors: Record<string, string> = {
	Urgent: "#ef4444",
	High: "#f97316",
	Medium: "#eab308",
	Low: "#22c55e",
	None: "#94a3b8",
}

// Simple bar chart component
const BarChart = defineComponent({
	props: {
		data: { type: Array as PropType<{ label: string; value: number; color: string }[]>, required: true },
		maxValue: { type: Number, default: 0 },
	},
	setup(props) {
		const computedMax = computed(() => {
			if (props.maxValue) return props.maxValue
			return Math.max(...props.data.map((d) => d.value), 1)
		})
		return { computedMax }
	},
	render() {
		return h('div', { class: 'space-y-2' },
			this.data.map((item) =>
				h('div', { key: item.label, class: 'flex items-center gap-3' }, [
					h('span', { class: 'text-sm text-gray-600 w-24 truncate' }, item.label),
					h('div', { class: 'flex-1 h-6 bg-gray-100 rounded overflow-hidden' },
						h('div', {
							class: 'h-full rounded transition-all duration-500',
							style: {
								width: `${(item.value / this.computedMax) * 100}%`,
								backgroundColor: item.color,
							},
						})
					),
					h('span', { class: 'text-sm font-medium w-8 text-right' }, item.value),
				])
			)
		)
	},
})

// Simple line chart for trends (simplified - just show placeholder)
const TrendChart = defineComponent({
	props: {
		data: { type: Array as PropType<{ date: string; value: number }[]>, required: true },
		height: { type: Number, default: 100 },
	},
	setup() {
		return {}
	},
	render() {
		return h('div', { class: 'text-sm text-gray-500 p-4 text-center' }, 'Trend chart visualization')
	},
})
</script>

<template>
	<div class="p-6 space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold text-gray-900">
				Dashboard
			</h1>
			<div class="text-sm text-gray-500">
				Last updated: {{ new Date().toLocaleString() }}
			</div>
		</div>

		<!-- Metrics cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<!-- Total tasks -->
			<div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500">Total Tasks</p>
						<p class="text-2xl font-bold text-gray-900">{{ analytics.totalTasks }}</p>
					</div>
					<div class="p-3 bg-blue-100 rounded-lg">
						<div class="i-mdi-format-list-checks w-6 h-6 text-blue-600" />
					</div>
				</div>
			</div>

			<!-- Completed -->
			<div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500">Completed</p>
						<p class="text-2xl font-bold text-emerald-600">{{ analytics.completedTasks }}</p>
					</div>
					<div class="p-3 bg-emerald-100 rounded-lg">
						<div class="i-mdi-check-circle w-6 h-6 text-emerald-600" />
					</div>
				</div>
				<div class="mt-2 text-xs text-gray-500">
					{{ productivityMetrics.completionRate }}% completion rate
				</div>
			</div>

			<!-- In Progress -->
			<div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500">In Progress</p>
						<p class="text-2xl font-bold text-amber-600">{{ analytics.inProgressTasks }}</p>
					</div>
					<div class="p-3 bg-amber-100 rounded-lg">
						<div class="i-mdi-progress-clock w-6 h-6 text-amber-600" />
					</div>
				</div>
			</div>

			<!-- Overdue -->
			<div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500">Overdue</p>
						<p class="text-2xl font-bold" :class="analytics.overdueTasks > 0 ? 'text-red-600' : 'text-gray-900'">
							{{ analytics.overdueTasks }}
						</p>
					</div>
					<div class="p-3 rounded-lg" :class="analytics.overdueTasks > 0 ? 'bg-red-100' : 'bg-gray-100'">
						<div
							class="i-mdi-alert-circle w-6 h-6"
							:class="analytics.overdueTasks > 0 ? 'text-red-600' : 'text-gray-600'"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Charts row -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Status breakdown -->
			<div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Tasks by Status</h3>
				<BarChart
					:data="Object.entries(analytics.tasksByStatus).map(([label, value]) => ({
						label,
						value,
						color: statusColors[label] || '#94a3b8',
					}))"
					:max-value="analytics.totalTasks"
				/>
			</div>

			<!-- Priority breakdown -->
			<div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Tasks by Priority</h3>
				<BarChart
					:data="Object.entries(analytics.tasksByPriority).map(([label, value]) => ({
						label,
						value,
						color: priorityColors[label] || '#94a3b8',
					}))"
					:max-value="analytics.totalTasks"
				/>
			</div>
		</div>

		<!-- Bottom row -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Velocity chart -->
			<div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Velocity</h3>
				<p class="text-sm text-gray-500 mb-2">Tasks completed per month</p>
				<div class="space-y-2">
					<div
						v-for="item in velocityData.slice(-6)"
						:key="item.period"
						class="flex items-center gap-3"
					>
						<span class="text-sm text-gray-600 w-20">{{ item.period }}</span>
						<div class="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
							<div
								class="h-full bg-indigo-500 rounded transition-all duration-500"
								:style="{ width: `${Math.min((item.completed / Math.max(...velocityData.map(v => v.completed))) * 100, 100)}%` }"
							/>
						</div>
						<span class="text-sm font-medium w-6 text-right">{{ item.completed }}</span>
					</div>
				</div>
			</div>

			<!-- Time tracking -->
			<div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h3>
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-600">Total time tracked</span>
						<span class="text-lg font-semibold">{{ formatDuration(analytics.timeTrackedTotal) }}</span>
					</div>
					<div class="border-t border-gray-200 pt-4">
						<p class="text-sm text-gray-500 mb-2">By user</p>
						<div class="space-y-1">
							<div
								v-for="[userId, minutes] in Object.entries(analytics.timeTrackedByUser).slice(0, 5)"
								:key="userId"
								class="flex items-center justify-between text-sm"
							>
								<span class="text-gray-600">{{ userId }}</span>
								<span class="font-medium">{{ formatDuration(minutes) }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Productivity metrics -->
			<div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Productivity</h3>
				<div class="space-y-4">
					<div>
						<div class="flex items-center justify-between mb-1">
							<span class="text-sm text-gray-600">Completion Rate</span>
							<span class="text-sm font-medium">{{ productivityMetrics.completionRate }}%</span>
						</div>
						<div class="h-2 bg-gray-100 rounded-full overflow-hidden">
							<div
								class="h-full bg-emerald-500 rounded-full"
								:style="{ width: `${productivityMetrics.completionRate}%` }"
							/>
						</div>
					</div>

					<div>
						<div class="flex items-center justify-between mb-1">
							<span class="text-sm text-gray-600">Overdue Rate</span>
							<span class="text-sm font-medium">{{ productivityMetrics.overdueRate }}%</span>
						</div>
						<div class="h-2 bg-gray-100 rounded-full overflow-hidden">
							<div
								class="h-full rounded-full"
								:class="productivityMetrics.overdueRate > 10 ? 'bg-red-500' : 'bg-amber-500'"
								:style="{ width: `${productivityMetrics.overdueRate}%` }"
							/>
						</div>
					</div>

					<div class="pt-2 border-t border-gray-200">
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600">Avg completion time</span>
							<span class="text-sm font-medium">{{ productivityMetrics.averageCompletionTime }}h</span>
						</div>
					</div>

					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-600">Tasks per day</span>
						<span class="text-sm font-medium">{{ productivityMetrics.tasksPerDay }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
