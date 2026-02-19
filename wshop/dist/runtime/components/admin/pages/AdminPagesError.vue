<template>
  <div class="text-center p-8 text-red-500">
    <p>Error loading pages: {{ error.message }}</p>
  </div>
</template>

<script setup>
defineProps({
  error: { type: Error, required: true }
});
</script>
