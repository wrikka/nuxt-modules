<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
    <p class="mt-1 text-3xl font-semibold text-gray-900">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
}>();
</script>
