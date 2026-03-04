<script setup lang="ts">
interface Props {
  as?: 'polite' | 'assertive' | 'off'
}

withDefaults(defineProps<Props>(), {
  as: 'polite'
})
</script>

<template>
  <div
    :aria-live="as"
    aria-atomic="true"
    class="sr-only"
  >
    <slot />
  </div>
</template>
