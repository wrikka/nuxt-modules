<script setup lang="ts">
interface Props {
  message: string;
}

defineProps<Props>();
</script>

<template>
  <span class="w-error-message">
    {{ message }}
  </span>
</template>
