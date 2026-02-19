<script setup lang="ts">
import { useInboxZero } from "../../composables/useInboxZero"

const { currentItem, progress, stats, nextItem, prevItem, markAsProcessed, skipItem } = useInboxZero()

const reasonLabels: Record<string, { label: string, color: string, icon: string }> = {
	unassigned: { label: "Unassigned", color: "bg-yellow-100 text-yellow-700", icon: "i-lucide-user-x" },
	no_due_date: { label: "No Due Date", color: "bg-gray-100 text-gray-700", icon: "i-lucide-calendar-x" },
	overdue: { label: "Overdue", color: "bg-red-100 text-red-700", icon: "i-lucide-alert-circle" },
	needs_review: { label: "Needs Review", color: "bg-blue-100 text-blue-700", icon: "i-lucide-eye" },
}
</script>

<template>
	<div class="inbox-zero">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h2 class="text-2xl font-bold">Inbox Zero</h2>
				<p class="text-gray-500">
					{{ progress.current }} of {{ progress.total }} tasks to triage
				</p>
			</div>
			<div class="flex gap-2 text-sm">
				<span class="px-2 py-1 rounded bg-yellow-100 text-yellow-700">{{ stats.unassigned }} unassigned</span>
				<span class="px-2 py-1 rounded bg-gray-100 text-gray-700">{{ stats.noDueDate }} no date</span>
				<span class="px-2 py-1 rounded bg-red-100 text-red-700">{{ stats.overdue }} overdue</span>
			</div>
		</div>

		<div v-if="currentItem" class="bg-white rounded-lg shadow-lg p-6">
			<div class="flex items-center gap-2 mb-4">
				<span
					class="px-2 py-1 rounded text-sm flex items-center gap-1"
					:class="reasonLabels[currentItem.reason].color"
				>
					<span :class="reasonLabels[currentItem.reason].icon" />
					{{ reasonLabels[currentItem.reason].label }}
				</span>
				<span class="text-gray-400">·</span>
				<span class="text-gray-500">{{ currentItem.task.list || "No List" }}</span>
			</div>

			<h3 class="text-xl font-semibold mb-2">{{ currentItem.task.title }}</h3>
			<p v-if="currentItem.task.description" class="text-gray-600 mb-4">
				{{ currentItem.task.description }}
			</p>

			<div class="flex gap-2 mb-6">
				<span
					class="px-2 py-1 rounded text-xs"
					:class="{
						'bg-red-100 text-red-700': currentItem.task.priority === 'Urgent',
						'bg-orange-100 text-orange-700': currentItem.task.priority === 'High',
						'bg-blue-100 text-blue-700': currentItem.task.priority === 'Medium',
						'bg-gray-100 text-gray-700': currentItem.task.priority === 'Low',
					}"
				>
					{{ currentItem.task.priority }}
				</span>
			</div>

			<div class="flex gap-3">
				<button
					class="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2"
					@click="markAsProcessed(currentItem.task.id)"
				>
					<span class="i-lucide-check" />
					Mark as Done
				</button>
				<button
					class="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2"
					@click="nextItem"
				>
					<span class="i-lucide-arrow-right" />
					Next Task
				</button>
				<button
					class="px-4 py-2 border rounded hover:bg-gray-50"
					@click="skipItem(currentItem.task.id)"
				>
					Skip
				</button>
			</div>
		</div>

		<div v-else class="text-center py-12">
			<div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<span class="i-lucide-check-circle text-4xl text-green-500" />
			</div>
			<h3 class="text-xl font-semibold mb-2">All Caught Up!</h3>
			<p class="text-gray-500">Your inbox is empty. Great job!</p>
		</div>
	</div>
</template>
