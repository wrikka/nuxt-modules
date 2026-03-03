<script setup lang="ts">
interface Props {
  class?: string
}

const _props = defineProps<Props>()
</script>

<template>
  <div :class="['p-6 pt-0', _props.class]">
    <slot />
  </div>
</template>
