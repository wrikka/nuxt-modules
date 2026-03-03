<script setup lang="ts">
interface Widget {
	id: string;
	name: string;
	visible: boolean;
	order: number;
}

const props = defineProps<{
	widgets: Widget[];
}>();

const emit = defineEmits<{
	toggle: [id: string];
	reorder: [widgets: Widget[]];
}>();

const localWidgets = ref([...props.widgets]);

watch(() => props.widgets, (newWidgets) => {
	localWidgets.value = [...newWidgets];
}, { deep: true });

const visibleWidgets = computed(() =>
	localWidgets.value.filter(w => w.visible).sort((a, b) => a.order - b.order)
);

const hiddenWidgets = computed(() =>
	localWidgets.value.filter(w => !w.visible)
);

function moveWidget(id: string, direction: "up" | "down") {
	const widget = localWidgets.value.find(w => w.id === id);
	if (!widget) return;

	const currentOrder = widget.order;
	const targetOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

	const targetWidget = localWidgets.value.find(w =>
		w.order === targetOrder && w.visible
	);
	if (targetWidget) {
		targetWidget.order = currentOrder;
		widget.order = targetOrder;
		emit("reorder", localWidgets.value);
	}
}

function toggleVisibility(id: string) {
	const widget = localWidgets.value.find(w => w.id === id);
	if (widget) {
		widget.visible = !widget.visible;
		emit("toggle", id);
	}
}
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
				<i class="i-mdi-view-dashboard text-gray-500" />
				Customize Dashboard
			</h3>
		</div>

		<div class="space-y-2">
			<div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
				Visible Widgets
			</div>
			<div
				v-for="widget in visibleWidgets"
				:key="widget.id"
				class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
			>
				<div class="flex items-center gap-2">
					<i class="i-mdi-drag text-gray-400 cursor-move" />
					<span class="text-sm text-gray-900 dark:text-white">{{
						widget.name
					}}</span>
				</div>
				<div class="flex items-center gap-1">
					<button
						class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
						@click="moveWidget(widget.id, 'up')"
						:disabled="widget.order === 0"
					>
						<i class="i-mdi-chevron-up" />
					</button>
					<button
						class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
						@click="moveWidget(widget.id, 'down')"
					>
						<i class="i-mdi-chevron-down" />
					</button>
					<button
						class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
						@click="toggleVisibility(widget.id)"
						title="Hide"
					>
						<i class="i-mdi-eye-off" />
					</button>
				</div>
			</div>

			<div v-if="hiddenWidgets.length > 0" class="mt-4">
				<div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
					Hidden Widgets
				</div>
				<div
					v-for="widget in hiddenWidgets"
					:key="widget.id"
					class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg opacity-60"
				>
					<span class="text-sm text-gray-600 dark:text-gray-400">{{
						widget.name
					}}</span>
					<button
						class="p-1 text-gray-400 hover:text-blue-500 transition-colors"
						@click="toggleVisibility(widget.id)"
						title="Show"
					>
						<i class="i-mdi-eye" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
