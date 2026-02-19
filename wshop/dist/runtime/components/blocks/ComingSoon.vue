<template>
  <div class="text-center p-8">
    <h1 class="text-2xl font-semibold">{{ title }}</h1>
    <p class="mt-4 text-gray-500">This feature is coming soon. Stay tuned!</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>
