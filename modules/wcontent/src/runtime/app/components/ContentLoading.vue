<script setup lang="ts">
interface Props {
  variant?: "spinner" | "dots" | "pulse";
  size?: "sm" | "md" | "lg";
}

withDefaults(defineProps<Props>(), {
  variant: "spinner",
  size: "md",
});
</script>

<template>
  <div class="content-loading" :class="[`variant-${variant}`, `size-${size}`]">
    <div class="loading-indicator">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<style scoped>
.content-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-indicator {
  position: relative;
}

.variant-spinner .loading-indicator {
  width: 2rem;
  height: 2rem;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.variant-dots .loading-indicator {
  display: flex;
  gap: 0.25rem;
}

.variant-dots .loading-indicator::before,
.variant-dots .loading-indicator::after {
  content: "";
  width: 0.5rem;
  height: 0.5rem;
  background: var(--color-primary);
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.variant-dots .loading-indicator {
  width: 0.5rem;
  height: 0.5rem;
  background: var(--color-primary);
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.variant-pulse .loading-indicator {
  width: 2rem;
  height: 2rem;
  background: var(--color-primary);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

.size-sm .loading-indicator,
.size-sm .loading-indicator::before,
.size-sm .loading-indicator::after {
  transform: scale(0.75);
}

.size-lg .loading-indicator,
.size-lg .loading-indicator::before,
.size-lg .loading-indicator::after {
  transform: scale(1.25);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
</style>
