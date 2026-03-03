<script setup lang="ts">

const { open: openModal } = useModal();
</script>

<template>
  <div class="flex items-center justify-between w-full text-sm text-muted-foreground">
    <!-- Left side: Search and Filters -->
    <div class="flex items-center gap-2">
      <FilterbarSearchInput />
      <FilterbarFilterDropdown />
      <FilterbarSortDropdown />
    </div>

    <!-- Right side: View and Actions -->
    <div class="flex items-center gap-2">
      <FilterbarViewOptions />
      <button class="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground" ~/click="openModal({ name: 'createTask' })">
        <Icon name="mdi:plus" />
        <span>New Task</span>
      </button>
    </div>
  </div>
</template>
