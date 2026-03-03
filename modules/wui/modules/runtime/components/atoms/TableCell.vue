<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  align?: 'left' | 'center' | 'right'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  align: 'left'
})

const _alignClasses = computed(() => ({
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}))
</script>

<template>
  <td
    :class="[
      'p-4 align-middle',
      _alignClasses[align],
      _props.class
    ]"
  >
    <slot />
  </td>
</template>
