<script setup lang="ts">
import type { List } from '~/shared/types/list';

const route = useRoute();
const { lists, fetchTasks } = useTaskData();
const { setListFilter, clearFilters } = useTaskFilter();
const { groupedTasks, isLoading } = useTaskLists();

const listId = computed(() => route.params.id as string);

// Find the current list from the store based on the route id
const list = computed(() => lists.value.find((l: List) => l.id === listId.value));

// Set and clear the list filter based on the component's lifecycle
onMounted(() => {
    if (list.value) {
        setListFilter(list.value.label);
    }
});

onUnmounted(() => {
    clearFilters(); // Or just setListFilter(null)
});

// Fetch tasks if they haven't been fetched yet
await useAsyncData('tasks', () => fetchTasks(), {
    server: false,
});

useHead({
    title: () => list.value?.label || 'List',
});
</script>

<template>
  <div v-if="list" class="space-y-8">
    <PageHeader :title="list.label" />
    <div v-if="isLoading">
      <LoadingIndicator />
    </div>
    <div v-else>
      <div v-for="(tasks, group) in groupedTasks" :key="group" class="space-y-4">
        <TaskList :title="group" :tasks="tasks" />
      </div>
    </div>
  </div>
  <div v-else>
    <p class="text-center text-muted-foreground">List not found.</p>
  </div>
</template>