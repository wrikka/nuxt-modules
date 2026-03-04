<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  row: Record<string, unknown>
  index: number
  striped?: boolean
  hoverable?: boolean
  clickable?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  striped: false,
  hoverable: true,
  clickable: false
})

const _rowClasses = computed(() => [
  'border-b transition-colors',
  _props.striped && _props.index % 2 === 1 && 'bg-muted/50',
  _props.hoverable && 'hover:bg-muted/50',
  _props.clickable && 'cursor-pointer'
])
</script>

<template>
  <tr :class="[_rowClasses, _props.class]">
    <slot />
  </tr>
</template>
