<script setup lang="ts">
const { viewMode: _viewMode } = useEmailView();
</script>

<template>
  <div class="flex items-center gap-2">
    <button @click="_viewMode = 'list'" class="p-2 rounded-full" :class="{ 'bg-gray-200 dark:bg-zinc-700': _viewMode === 'list' }">
      <Icon name="mdi:view-list" class="text-xl" />
    </button>
    <button @click="_viewMode = 'grid'" class="p-2 rounded-full" :class="{ 'bg-gray-200 dark:bg-zinc-700': _viewMode === 'grid' }">
      <Icon name="mdi:view-grid" class="text-xl" />
    </button>
  </div>
</template>
