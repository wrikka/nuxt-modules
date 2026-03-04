<script setup lang="ts">
const props = defineProps<{ tasks: Task[] }>();
const { groupedTasks, isLoading } = useTaskLists();
</script>

<template>
  <div class="space-y-8">
    <AtomsSpinner v-if="isLoading" class="w-8 h-8 mx-auto block" />
    <AtomsEmpty
      v-else-if="Object.keys(groupedTasks).length === 0"
      title="No tasks found"
      message="Get started by creating a new task."
      icon="mdi:checkbox-marked-circle-outline"
    />
        <TaskList v-else
      v-for="(tasks, title) in groupedTasks"
      :key="title"
      :title="title as string"
      :tasks="tasks"
    />
  </div>
</template>
