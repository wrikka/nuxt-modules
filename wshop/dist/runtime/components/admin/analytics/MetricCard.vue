<template>
  <div class="p-4 bg-white rounded-lg shadow">
    <h3 class="text-gray-500">{{ title }}</h3>
    <p class="text-2xl font-bold">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true }
});
</script>
