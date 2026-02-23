<script setup lang="ts">
// Folder logic will be added later
const _folders = ref([
  { id: '1', name: 'All Notes' },
  { id: '2', name: 'Project X' },
  { id: '3', name: 'Ideas' },
])
</script>

<template>
  <div class="h-full w-64 bg-gray-100 p-4 dark:bg-gray-900">
    <h2 class="mb-4 text-lg font-bold">Folders</h2>
    <ul>
      <li v-for="folder in _folders" :key="folder.id" class="mb-2 cursor-pointer rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-800">
        {{ folder.name }}
      </li>
    </ul>
    <button class="mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
      New Folder
    </button>
  </div>
</template>
