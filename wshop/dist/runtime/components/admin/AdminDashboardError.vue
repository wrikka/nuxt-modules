<template>
  <div class="p-8 text-red-500">
    <p>Error loading analytics: {{ error.message }}</p>
  </div>
</template>

<script setup>
defineProps({
  error: { type: Error, required: true }
});
</script>
