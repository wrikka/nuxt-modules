<script setup lang="ts">
import type { SortableEvent } from "sortablejs";

const props = defineProps({
	tasks: {
		required: true,
		type: Array as PropType<Task[]>,
	},
	status: {
		required: true,
		type: String as PropType<Task["status"]>,
	},
});

const emit = defineEmits<{
	(e: "end", event: DragEndEvent): void;
	(e: "update:tasks", value: Task[]): void;
}>();

const localTasks = computed({
	get() {
		return props.tasks;
	},
	set(value) {
		emit("update:tasks", value);
	},
});


function onDragEnd(event: SortableEvent) {
	const { item, to } = event;
	const newStatus = to.dataset.status as Task["status"];
	emit("end", { item, newStatus });
}
</script>

<template>
  <div class="w-full md:w-72 flex-shrink-0">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <h2 class="font-semibold text-foreground">{{ status }}</h2>
        <span class="text-sm text-muted-foreground">{{ tasks.length }}</span>
      </div>
    </div>
    <VueDraggableNext
      v-model="localTasks"
      class="space-y-3 h-full"
      group="tasks"
      :data-status="status"
      item-key="id"
      ~/end="onDragEnd"
    >
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
    </VueDraggableNext>
  </div>
</template>
