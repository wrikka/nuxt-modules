<template>
  <div class="p-4">
    <div v-for="n in 10" :key="n" class="animate-pulse flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
      <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-4 flex-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
</template>
