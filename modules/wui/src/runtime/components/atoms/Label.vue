<script setup lang="ts">
interface Props {
  class?: string
  for?: string
}

const _props = defineProps<Props>()
</script>

<template>
  <label :for="for" :class="['text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', _props.class]">
    <slot />
  </label>
</template>
