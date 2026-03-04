<script setup lang="ts">
interface Props {
  class?: string
}

const _props = defineProps<Props>()
</script>

<template>
  <main :class="['flex-1 min-w-0', _props.class]">
    <slot />
  </main>
</template>
