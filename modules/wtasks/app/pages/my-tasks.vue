<script setup lang="ts">
const { fetchTasks, isLoading } = useTaskData();
const { setAssigneeFilter, clearFilters } = useTaskFilter();
const { tasks: filteredTasks } = useTaskLists();
const currentUser = 'User 1'; // Hardcoded for now

onMounted(() => {
    setAssigneeFilter(currentUser);
});

onUnmounted(() => {
    clearFilters(); // Or just setAssigneeFilter(null)
});

// Fetch tasks if they haven't been fetched yet
await useAsyncData('tasks', () => fetchTasks(), {
    server: false,
});

useHead({
  title: 'My Tasks',
});
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-white">My Tasks</h1>
    <div v-if="isLoading">
      <LoadingIndicator />
    </div>
    <div v-else-if="filteredTasks.length > 0">
      <TaskList :title="`Tasks assigned to ${currentUser}`" :tasks="filteredTasks" />
    </div>
    <div v-else>
      <EmptyState
        title="No tasks assigned to you"
        message="You have no tasks assigned to you at the moment."
        icon="mdi:check-circle-outline"
      />
    </div>
  </div>
</template>
