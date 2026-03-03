<script setup lang="ts">

const props = defineProps<{ tasks: Task[] }>();
const { groupedTasks, isLoading } = useTaskLists();
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <LoadingIndicator v-if="isLoading" />
    <EmptyState
      v-else-if="Object.keys(groupedTasks).length === 0"
      title="No tasks found"
      message="Get started by creating a new task."
      icon="mdi:checkbox-marked-circle-outline"
    />
        <KanbanColumn v-else
      v-for="(tasks, title) in groupedTasks"
      :key="title"
      :status="title as Status"
      :tasks="tasks"
    />
  </div>
</template>
