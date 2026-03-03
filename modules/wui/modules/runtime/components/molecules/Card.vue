<script setup lang="ts">
interface Props {
  class?: string
}

const _props = defineProps<Props>()
</script>

<template>
  <div :class="['rounded-lg border bg-card text-card-foreground shadow-sm', _props.class]">
    <slot />
  </div>
</template>
