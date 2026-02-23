<script setup lang="ts">
const _searchQuery = defineModel<string>()
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <div class="relative flex-grow">
      <div class="i-mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></div>
      <input
        v-model="_searchQuery"
        type="text"
        placeholder="Search notes..."
        class="w-full rounded-md border bg-white py-2 pl-10 pr-4 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <button class="flex items-center gap-2 rounded-md border bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
      <div class="i-mdi-tag-outline"></div>
      <span>Tags</span>
    </button>
  </div>
</template>
