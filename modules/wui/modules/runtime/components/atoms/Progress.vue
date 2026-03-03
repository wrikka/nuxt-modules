<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value?: number
  max?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  max: 100
})

const _percentage = computed(() => {
  return Math.min(Math.max((props.value || 0) / props.max * 100, 0), 100)
})
</script>

<template>
  <div :class="['relative h-4 w-full overflow-hidden rounded-full bg-secondary', props.class]">
    <div
      class="h-full w-full flex-1 bg-primary transition-all"
      :style="{ transform: `translateX(-${100 - _percentage.value}%)` }"
    />
  </div>
</template>
