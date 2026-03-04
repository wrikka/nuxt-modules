<script setup lang="ts">
interface Props {
  message?: string;
}

withDefaults(defineProps<Props>(), {
  message: "Failed to load content",
});
</script>

<template>
  <div class="content-error">
    <div class="error-icon">⚠️</div>
    <p class="error-message">{{ message }}</p>
  </div>
</template>

<style scoped>
.content-error {
  padding: 2rem;
  text-align: center;
  color: var(--color-error);
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.error-message {
  font-size: 1rem;
}
</style>
