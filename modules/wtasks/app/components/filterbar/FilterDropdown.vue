<script setup lang="ts">
const { setStatusFilter, setAssigneeFilter, clearFilters, filter } = useTaskFilter();
const { allStatuses, allAssignees } = useTaskData();
const isFilterOpen = ref(false);

const activeFiltersCount = computed(() => {
	let count = 0;
	if (filter.value.status) count++;
	if (filter.value.assignee) count++;
	return count;
});
</script>

<template>
  <DropdownMenu v-model="isFilterOpen" trigger-class="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-secondary hover:bg-secondary/80">
    <template #trigger>
      <Icon name="mdi:filter-variant" />
      <span>Filter</span>
      <span v-if="activeFiltersCount > 0" class="px-2 py-0.5 text-xs rounded-full bg-primary/80 text-primary-foreground">{{ activeFiltersCount }}</span>
    </template>
    <template #content>
      <div class="divide-y divide-border">
        <div class="p-2">
          <h4 class="text-xs font-bold text-muted-foreground px-1 py-1">Status</h4>
          <div class="space-y-1 mt-1">
            <button v-for="status in allStatuses" :key="status" ~/click="() => { setStatusFilter(status); isFilterOpen = false; }" class="w-full text-left px-2 py-1 hover:bg-accent rounded-md">{{ status }}</button>
          </div>
        </div>
        <div class="p-2">
          <h4 class="text-xs font-bold text-muted-foreground px-1 py-1">Assignee</h4>
          <div class="space-y-1 mt-1">
            <button v-for="assignee in allAssignees" :key="assignee" ~/click="() => { setAssigneeFilter(assignee as string); isFilterOpen = false; }" class="w-full text-left px-2 py-1 hover:bg-accent rounded-md">{{ assignee }}</button>
          </div>
        </div>
        <div class="p-2">
          <button ~/click="() => { clearFilters(); isFilterOpen = false; }" class="w-full text-left px-2 py-1 text-destructive hover:bg-accent rounded-md">Clear all filters</button>
        </div>
      </div>
    </template>
  </DropdownMenu>
</template>
