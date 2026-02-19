<script setup>
defineProps({
  name: { type: String, required: true },
  price: { type: [String, Number], required: true },
  description: { type: [String, null], required: true }
});
</script>

<template>
  <div>
    <h1 class="text-4xl font-bold mb-2">{{ name }}</h1>
    <p class="text-3xl text-gray-800 mb-6">${{ price }}</p>
    <p class="text-gray-600 mb-6">{{ description }}</p>
  </div>
</template>
