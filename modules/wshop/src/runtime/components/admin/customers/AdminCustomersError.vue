<template>
  <div class="text-center p-8 text-red-500">
    <p>Error loading customers: {{ error.message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: Error;
}>();
</script>
