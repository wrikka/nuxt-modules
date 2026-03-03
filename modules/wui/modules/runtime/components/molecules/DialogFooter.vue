<script setup lang="ts">
interface Props {
  class?: string
}

const _props = defineProps<Props>()
</script>

<template>
  <div :class="['flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', _props.class]">
    <slot />
  </div>
</template>
