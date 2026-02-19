<script setup lang="ts">
import { useTable } from "../../composables/useTable"

const {
	visibleColumns,
	tableRows,
	sortColumn,
	sortDirection,
	isAllSelected,
	isIndeterminate,
	toggleSelection,
	selectAll,
	deselectAll,
	toggleExpansion,
	sortBy,
	bulkUpdateStatus,
	bulkDelete,
	getCellValue,
} = useTable()

const emit = defineEmits<{
	(e: "selectTask", taskId: string): void
	(e: "editTask", taskId: string): void
}>()

const statusColors: Record<string, string> = {
	Backlog: "bg-slate-100 text-slate-700",
	"In Design": "bg-indigo-100 text-indigo-700",
	"In Progress": "bg-amber-100 text-amber-700",
	"In Review": "bg-blue-100 text-blue-700",
	Done: "bg-emerald-100 text-emerald-700",
	Cancelled: "bg-red-100 text-red-700",
}

const priorityClasses: Record<string, string> = {
	Urgent: "text-red-600 font-semibold",
	High: "text-orange-600 font-medium",
	Medium: "text-yellow-600",
	Low: "text-green-600",
	None: "text-gray-500",
}
</script>

<template>
	<div class="flex flex-col h-full">
		<!-- Bulk actions bar -->
		<div
			v-if="tableRows.some(r => r.selected)"
			class="flex items-center gap-4 mb-4 px-4 py-2 bg-blue-50 rounded-lg"
		>
			<span class="text-sm text-blue-700">
				{{ tableRows.filter(r => r.selected).length }} selected
			</span>
			<div class="flex items-center gap-2">
				<select
					class="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
					@change="(e) => bulkUpdateStatus((e.target as HTMLSelectElement).value as any)"
				>
					<option value="">Change status...</option>
					<option value="Backlog">Backlog</option>
					<option value="In Design">In Design</option>
					<option value="In Progress">In Progress</option>
					<option value="In Review">In Review</option>
					<option value="Done">Done</option>
					<option value="Cancelled">Cancelled</option>
				</select>
				<button
					class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
					@click="bulkDelete"
				>
					Delete
				</button>
			</div>
		</div>

		<!-- Table -->
		<div class="flex-1 overflow-auto border border-gray-200 rounded-lg">
			<table class="w-full text-left">
				<thead class="bg-gray-50 sticky top-0 z-10">
					<tr>
						<!-- Selection checkbox -->
						<th class="px-4 py-3 w-10">
							<input
								type="checkbox"
								:checked="isAllSelected"
								:indeterminate="isIndeterminate"
								class="rounded border-gray-300"
								@change="isAllSelected ? deselectAll() : selectAll()"
							>
						</th>

						<!-- Expand column -->
						<th class="px-2 py-3 w-8" />

						<!-- Data columns -->
						<th
							v-for="column in visibleColumns"
							:key="column.key"
							class="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
							:style="column.width ? { width: `${column.width}px` } : {}"
							@click="column.sortable && sortBy(column.key)"
						>
							<div class="flex items-center gap-1">
								{{ column.label }}
								<template v-if="column.sortable">
									<div
										v-if="sortColumn === column.key"
										class="w-4 h-4"
										:class="sortDirection === 'asc' ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'"
									/>
									<div
										v-else
										class="i-mdi-chevron-up w-4 h-4 opacity-30"
									/>
								</template>
							</div>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					<template
						v-for="row in tableRows"
						:key="row.task.id"
					>
						<tr
							class="hover:bg-gray-50 transition-colors"
							:class="row.selected ? 'bg-blue-50' : ''"
						>
							<!-- Selection -->
							<td class="px-4 py-3">
								<input
									type="checkbox"
									:checked="row.selected"
									class="rounded border-gray-300"
									@change="toggleSelection(row.task.id)"
								>
							</td>

							<!-- Expand toggle -->
							<td class="px-2 py-3">
								<button
									v-if="row.task.subtasks?.length"
									class="p-1 hover:bg-gray-200 rounded transition-colors"
									@click="toggleExpansion(row.task.id)"
								>
									<div
										class="w-4 h-4 transition-transform"
										:class="[
											row.expanded ? 'i-mdi-chevron-down' : 'i-mdi-chevron-right',
										]"
									/>
								</button>
							</td>

							<!-- Data cells -->
							<td
								v-for="column in visibleColumns"
								:key="column.key"
								class="px-4 py-3 text-sm"
							>
								<div
									v-if="column.key === 'title'"
									class="flex items-center gap-2"
								>
									<span
										class="font-medium cursor-pointer hover:text-blue-600"
										@click="emit('selectTask', row.task.id)"
									>
										{{ row.task.title }}
									</span>
									<button
										class="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
										@click="emit('editTask', row.task.id)"
									>
										<div class="i-mdi-pencil w-4 h-4 text-gray-400" />
									</button>
								</div>

								<div
									v-else-if="column.key === 'status'"
									class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
									:class="statusColors[row.task.status]"
								>
									{{ row.task.status }}
								</div>

								<div
									v-else-if="column.key === 'priority'"
									:class="priorityClasses[row.task.priority]"
								>
									{{ row.task.priority }}
								</div>

								<div
									v-else-if="column.key === 'assignee'"
									class="flex items-center gap-2"
								>
									<img
										v-if="row.task.assignee?.avatarUrl"
										:src="row.task.assignee.avatarUrl"
										class="w-6 h-6 rounded-full"
										alt=""
									>
									<span class="text-gray-700">{{ getCellValue(row.task, 'assignee') }}</span>
								</div>

								<div
									v-else-if="column.key === 'tags'"
									class="flex flex-wrap gap-1"
								>
									<span
										v-for="tag in row.task.tags.slice(0, 3)"
										:key="tag.id"
										class="inline-flex items-center px-2 py-0.5 rounded text-xs"
										:style="{ backgroundColor: tag.color + '20', color: tag.color, border: `1px solid ${tag.color}40` }"
									>
										{{ tag.name }}
									</span>
									<span
										v-if="row.task.tags.length > 3"
										class="text-xs text-gray-500"
									>
										+{{ row.task.tags.length - 3 }}
									</span>
								</div>

								<div
									v-else-if="column.key === 'progress'"
									class="flex items-center gap-2"
								>
									<div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
										<div
											class="h-full bg-blue-500 rounded-full transition-all"
											:style="{ width: `${row.task.progress || 0}%` }"
										/>
									</div>
									<span class="text-xs text-gray-500 w-8">{{ row.task.progress || 0 }}%</span>
								</div>

								<span
									v-else
									class="text-gray-700"
								>
									{{ getCellValue(row.task, column.key) }}
								</span>
							</td>
						</tr>

						<!-- Expanded subtasks -->
						<tr
							v-if="row.expanded && row.task.subtasks?.length"
							:key="`${row.task.id}-expanded`"
							class="bg-gray-50/50"
						>
							<td colspan="100%" class="px-4 py-2 pl-16">
								<div class="space-y-2">
									<div
										v-for="subtask in row.task.subtasks"
										:key="subtask.id"
										class="flex items-center gap-2 text-sm"
									>
										<div
											class="w-2 h-2 rounded-full"
											:class="subtask.completed ? 'bg-green-500' : 'bg-gray-300'"
										/>
										<span
											:class="subtask.completed ? 'line-through text-gray-400' : 'text-gray-700'"
										>
											{{ subtask.title }}
										</span>
									</div>
								</div>
							</td>
						</tr>
					</template>
				</tbody>
			</table>
		</div>
	</div>
</template>
