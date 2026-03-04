<script setup lang="ts">
interface Props {
  class?: string
}

const _props = defineProps<Props>()
</script>

<template>
  <div :class="['text-sm [&_p]:leading-relaxed', _props.class]">
    <slot />
  </div>
</template>
