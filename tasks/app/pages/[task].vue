<script setup lang="ts">
import type { Task } from '~/shared/types/task';

const route = useRoute();
const taskId = route.params.task as string;

const { data: task, pending, refresh } = await useFetch<Task>(`/api/tasks/${taskId}`);
const { updateTask } = useTaskApi();

if (!task.value) {
  throw createError({ statusCode: 404, statusMessage: 'Task not found' });
}

const isEditingDescription = ref(false);
const editableDescription = ref(task.value.description || '');

async function saveDescription() {
    if (!task.value) return;
    await updateTask({ id: task.value.id, description: editableDescription.value });
    isEditingDescription.value = false;
    refresh(); // Refresh data to show the latest description
}

function cancelEdit() {
    if (!task.value) return;
    editableDescription.value = task.value.description || '';
    isEditingDescription.value = false;
}

useHead({
  title: task.value?.title,
});
</script>

<template>
  <div v-if="pending">
    <LoadingIndicator />
  </div>
  <div v-else-if="task" class="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
    <!-- Main Content -->
    <div class="lg:col-span-2 space-y-6">
      <h1 class="text-3xl font-bold text-white">{{ task.title }}</h1>
      <div>
        <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-semibold text-gray-300">Description</h2>
            <button v-if="!isEditingDescription" ~/click="isEditingDescription = true" class="text-sm text-primary hover:underline">Edit</button>
        </div>
        <div v-if="!isEditingDescription">
            <div v-if="task.description" v-html="task.description" class="prose dark:prose-invert max-w-none"></div>
            <p v-else class="text-muted-foreground italic">No description provided.</p>
        </div>
        <div v-else>
            <DescriptionEditor v-model="editableDescription" />
            <div class="flex justify-end gap-2 mt-4">
                <button ~/click="cancelEdit" class="px-4 py-2 rounded-md text-sm font-medium bg-secondary hover:bg-secondary/80">Cancel</button>
                <button ~/click="saveDescription" class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90">Save</button>
            </div>
        </div>
      </div>
      <TaskDetailSubtasks :task="task" />
      <TaskComments :task="task" />
    </div>

    <!-- Right Sidebar (Details) -->
    <TaskDetailSidebar :task="task" />
  </div>
</template>
