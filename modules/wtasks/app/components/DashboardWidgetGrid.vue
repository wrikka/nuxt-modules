<script setup lang="ts">
const { widgets, isEditing, availableWidgets, addWidget, removeWidget, toggleEditMode, resetToDefault } = useDashboardWidgets()

const showWidgetSelector = ref(false)

const handleAddWidget = (type: typeof availableWidgets[0]["type"]) => {
	const widget = availableWidgets.find(w => w.type === type)
	if (widget) {
		addWidget(type, widget.title)
		showWidgetSelector = false
	}
}
</script>

<template>
	<div class="space-y-4">
		<!-- Toolbar -->
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h2>
			<div class="flex gap-2">
				<button
					v-if="isEditing"
					class="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
					@click="toggleEditMode"
				>
					Save Layout
				</button>
				<button
					class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg"
					:class="isEditing ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'"
					@click="toggleEditMode"
				>
					{{ isEditing ? 'Cancel' : 'Edit Layout' }}
				</button>
			</div>
		</div>

		<!-- Widget Grid -->
		<div class="grid grid-cols-4 gap-4 auto-rows-min">
			<div
				v-for="widget in widgets"
				:key="widget.id"
				class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
				:class="`col-span-${widget.position.w} row-span-${widget.position.h}`"
				:style="{ gridColumn: `span ${widget.position.w}`, gridRow: `span ${widget.position.h}` }"
			>
				<!-- Widget Header -->
				<div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
					<h3 class="font-medium text-gray-900 dark:text-white">{{ widget.title }}</h3>
					<div v-if="isEditing" class="flex gap-1">
						<button
							class="p-1 text-gray-400 hover:text-red-500"
							@click="removeWidget(widget.id)"
						>
							<Icon name="mdi:close" class="w-4 h-4" />
						</button>
					</div>
				</div>

				<!-- Widget Content -->
				<div class="p-4">
					<!-- Stats Widget -->
					<div v-if="widget.type === 'stats'" class="grid grid-cols-2 gap-4">
						<div class="text-center">
							<p class="text-2xl font-bold text-blue-600">24</p>
							<p class="text-xs text-gray-500">Total Tasks</p>
						</div>
						<div class="text-center">
							<p class="text-2xl font-bold text-green-600">18</p>
							<p class="text-xs text-gray-500">Completed</p>
						</div>
						<div class="text-center">
							<p class="text-2xl font-bold text-yellow-600">4</p>
							<p class="text-xs text-gray-500">In Progress</p>
						</div>
						<div class="text-center">
							<p class="text-2xl font-bold text-purple-600">2</p>
							<p class="text-xs text-gray-500">Overdue</p>
						</div>
					</div>

					<!-- Chart Widget -->
					<div v-if="widget.type === 'chart'" class="h-32 flex items-end justify-around">
						<div
							v-for="(h, i) in [40, 70, 30, 85, 60]"
							:key="i"
							class="w-8 bg-blue-500 rounded-t"
							:style="{ height: h + '%' }"
						/>
					</div>

					<!-- Tasks Widget -->
					<div v-if="widget.type === 'tasks'" class="space-y-2">
						<div
							v-for="i in 3"
							:key="i"
							class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
						>
							<Icon name="mdi:checkbox-blank-circle" class="w-4 h-4 text-blue-500" />
							<span class="text-sm text-gray-700 dark:text-gray-300">Task {{ i }}</span>
						</div>
					</div>

					<!-- Calendar Widget -->
					<div v-if="widget.type === 'calendar'">
						<div class="grid grid-cols-7 gap-1 text-center text-xs">
							<span v-for="d in ['S','M','T','W','T','F','S']" :key="d" class="text-gray-400">{{ d }}</span>
							<span
								v-for="i in 31"
								:key="i"
								class="py-1"
								:class="{
									'bg-blue-500 text-white rounded': i === 15,
									'text-gray-700 dark:text-gray-300': i !== 15
								}"
							>
								{{ i }}
							</span>
						</div>
					</div>

					<!-- Recent Widget -->
					<div v-if="widget.type === 'recent'" class="space-y-3">
						<div class="flex items-center gap-2 text-sm">
							<Icon name="mdi:check-circle" class="w-4 h-4 text-green-500" />
							<span class="text-gray-600 dark:text-gray-400">Completed task</span>
							<span class="text-xs text-gray-400">2h ago</span>
						</div>
					</div>

					<!-- Custom Widget -->
					<div v-if="widget.type === 'custom'" class="text-center text-gray-500">
						<Icon name="mdi:widgets" class="w-8 h-8 mx-auto mb-2" />
						<p class="text-sm">Custom content here</p>
					</div>
				</div>
			</div>

			<!-- Add Widget Button -->
			<button
				v-if="isEditing"
				class="col-span-1 row-span-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
				@click="showWidgetSelector = true"
			>
				<Icon name="mdi:plus" class="w-8 h-8 text-gray-400 mb-2" />
				<span class="text-sm text-gray-500">Add Widget</span>
			</button>
		</div>

		<!-- Widget Selector Modal -->
		<BaseModal v-if="showWidgetSelector" title="Add Widget" @close="showWidgetSelector = false">
			<div class="grid grid-cols-2 gap-3">
				<button
					v-for="widget in availableWidgets"
					:key="widget.type"
					class="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
					@click="handleAddWidget(widget.type)"
				>
					<Icon :name="widget.icon" class="w-8 h-8 text-gray-600 dark:text-gray-400" />
					<span class="text-sm font-medium">{{ widget.title }}</span>
				</button>
			</div>
		</BaseModal>
	</div>
</template>
