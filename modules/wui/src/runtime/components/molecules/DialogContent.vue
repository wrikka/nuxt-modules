<script setup lang="ts">
interface Props {
  class?: string
}

const _props = defineProps<Props>()
</script>

<template>
  <div :class="['relative flex flex-col gap-4 p-6', _props.class]">
    <slot />
  </div>
</template>
