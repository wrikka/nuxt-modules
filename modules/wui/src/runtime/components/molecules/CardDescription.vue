<script setup lang="ts">
interface Props {
  class?: string
}

const _props = defineProps<Props>()
</script>

<template>
  <p :class="['text-sm text-muted-foreground', _props.class]">
    <slot />
  </p>
</template>
