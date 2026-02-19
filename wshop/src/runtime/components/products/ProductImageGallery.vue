<script setup lang="ts">
interface Props {
  imageUrl: string;
  altText: string;
}

defineProps<Props>();
</script>

<template>
  <div>
    <img :src="imageUrl" :alt="altText" class="w-full rounded-lg shadow-lg">
  </div>
</template>
