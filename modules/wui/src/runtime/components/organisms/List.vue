<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  bordered?: boolean
  divided?: boolean
  compact?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  bordered: false,
  divided: true,
  compact: false
})

const _classes = computed(() => [
  'list-none',
  _props.bordered && 'rounded-md border',
  _props.divided && 'divide-y'
])
</script>

<template>
  <ul :class="[_classes, _props.class]" role="list">
    <slot />
  </ul>
</template>
