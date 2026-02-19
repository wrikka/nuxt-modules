<script setup lang="ts">
import { ref } from 'vue';
import { PrioritySchema, type Task } from '~/shared/types/task';

const props = defineProps<{ task: Task }>();

const { updateTask } = useTaskApi();
const priorities = PrioritySchema.options;
const isEditing = ref(false);
const selectedPriority = ref(props.task.priority);

async function updatePriority() {
  await updateTask({ id: props.task.id, priority: selectedPriority.value });
  isEditing.value = false;
}

function openEdit() {
  isEditing.value = true;
}
</script>

<template>
  <div class="flex justify-between items-center">
    <span class="text-gray-400">Priority</span>
    <select
      v-if="isEditing"
      v-model="selectedPriority"
      class="w-1/2 rounded border border-gray-600 bg-[#101012] px-2 py-1 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
      ~/change="updatePriority"
      ~/blur="isEditing = false"
    >
      <option v-for="p in priorities" :key="p" :value="p">{{ p }}</option>
    </select>
    <button v-else ~/click="openEdit" class="font-medium text-white hover:bg-gray-700/80 p-1 rounded">
      {{ task.priority }}
    </button>
  </div>
</template>
