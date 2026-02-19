<template>
  <p class="my-4">
    {{ text }}
  </p>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: "Paragraph text"
  }
});
</script>
