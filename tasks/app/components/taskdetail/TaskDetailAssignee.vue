<script setup lang="ts">
import type { Task } from '~/shared/types/task';

const props = defineProps<{ task: Task }>();

const { allAssignees } = useTaskData();
const { updateTask } = useTaskApi();
const isEditing = ref(false);
const selectedAssigneeName = ref(props.task.assignee?.name);

// This is a simplified version. In a real app, you'd have a list of user objects.
const assigneesList = computed(() => 
    allAssignees.value.filter((name): name is string => !!name)
        .map(name => ({ name, avatarUrl: `https://i.pravatar.cc/150?u=${name}` }))
)

async function updateAssignee() {
  const name = selectedAssigneeName.value;
  if (name) {
    const assignee = assigneesList.value.find((a: { name: string }) => a.name === name);
    if (assignee) {
      await updateTask({ id: props.task.id, assignee });
    }
  } else {
    await updateTask({ id: props.task.id, assignee: undefined });
  }
  isEditing.value = false;
}

function openEdit() {
  isEditing.value = true;
}
</script>

<template>
  <div class="flex justify-between items-center">
    <span class="text-gray-400">Assignee</span>
    <select
      v-if="isEditing"
      v-model="selectedAssigneeName"
      class="w-1/2 rounded border border-gray-600 bg-[#101012] px-2 py-1 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
      ~/change="updateAssignee"
      ~/blur="isEditing = false"
    >
      <option v-for="a in assigneesList" :key="a.name" :value="a.name">{{ a.name }}</option>
    </select>
    <button v-else ~/click="openEdit" class="flex items-center gap-2 font-medium text-white hover:bg-gray-700/80 p-1 rounded">
      <img v-if="task.assignee" :src="task.assignee.avatarUrl" :alt="task.assignee.name" class="w-5 h-5 rounded-full" />
      <span v-if="task.assignee">{{ task.assignee.name }}</span>
      <span v-else>Unassigned</span>
    </button>
  </div>
</template>
