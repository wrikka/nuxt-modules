<template>
  <p class="my-4">
    {{ text }}
  </p>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: 'Paragraph text',
  },
});
</script>
