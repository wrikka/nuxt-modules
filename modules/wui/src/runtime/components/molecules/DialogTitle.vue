<script setup lang="ts">
interface Props {
  class?: string
}

const _props = defineProps<Props>()
</script>

<template>
  <h2 :class="['text-lg font-semibold leading-none tracking-tight', _props.class]">
    <slot />
  </h2>
</template>
