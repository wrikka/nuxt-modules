<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 v-if="title" class="text-lg font-semibold mb-4">{{ title }}</h2>
    <slot />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title?: string;
  }>();
</script>
