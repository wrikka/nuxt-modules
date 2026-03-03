<template>
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold">{{ title }}</h1>
    <div class="flex space-x-4">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title: string;
  }>();
</script>
