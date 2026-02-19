<script setup lang="ts">

import type { Task } from '~/shared/types/task';

const props = defineProps<{
  task: Task
  view?: 'card' | 'list'
}>();

const { open: openContextMenu } = useContextMenu();
const { open: openModal } = useModal();
const { deleteTask } = useTaskApi();

function _showContextMenu(event: MouseEvent) {
	openContextMenu({
		options: [
			{
				action: () =>
					openModal({
						task: JSON.parse(JSON.stringify(props.task)),
						name: 'editTask',
					}),
				label: 'Edit',
			},
			{
				action: () =>
					openModal({
						task: props.task,
						name: 'deleteTask',
						onConfirm: () => deleteTask(props.task.id),
					}),
				label: 'Delete',
			},
		],
		x: event.clientX,
		y: event.clientY,
	});
}
</script>

<template>
  <NuxtLink :to="`/tasks/${task.id}`" ~/contextmenu.prevent="_showContextMenu">
    <TaskCardCardView v-if="view === 'card'" :task="task" />
    <TaskCardListView v-else :task="task" />
  </NuxtLink>
</template>
