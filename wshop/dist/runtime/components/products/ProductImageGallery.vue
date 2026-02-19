<script setup>
defineProps({
  imageUrl: { type: String, required: true },
  altText: { type: String, required: true }
});
</script>

<template>
  <div>
    <img :src="imageUrl" :alt="altText" class="w-full rounded-lg shadow-lg">
  </div>
</template>
