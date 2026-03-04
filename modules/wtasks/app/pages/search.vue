<script setup lang="ts">
const { setSearchTerm, clearFilters } = useTaskFilter();
const { tasks: filteredTasks, isLoading } = useTaskLists();
const searchTerm = ref('');

watchDebounced(
  searchTerm,
  (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  },
  { debounce: 300 },
);

// Clear search term when leaving the page
onUnmounted(() => {
  clearFilters();
});

useHead({
  title: 'Search Tasks',
});
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-white">Search Tasks</h1>
    <div class="relative w-full">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon name="mdi:magnify" class="text-gray-500 w-5 h-5" />
      </div>
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search by title..."
        class="w-full rounded-md border border-gray-700 bg-[#101012] pl-10 pr-4 py-2 text-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
        autofocus
      />
    </div>

    <div v-if="isLoading">
      <AtomsSpinner class="w-8 h-8 mx-auto" />
    </div>
    <div v-else-if="searchTerm && filteredTasks.length > 0">
      <TaskList title="Search Results" :tasks="filteredTasks" />
    </div>
    <div v-else-if="searchTerm && filteredTasks.length === 0">
      <AtomsEmpty
        title="No tasks found"
        :message="`No tasks found matching your search for '${searchTerm}'.`"
        icon="mdi:magnify"
      />
    </div>
    <div v-else>
       <AtomsEmpty
        title="Search for tasks"
        message="Enter a search term above to find tasks by their title."
        icon="mdi:magnify"
      />
    </div>
  </div>
</template>
