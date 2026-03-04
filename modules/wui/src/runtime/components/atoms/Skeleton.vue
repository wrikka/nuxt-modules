<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  rows?: number
  columns?: number
  width?: string
  height?: string
  circle?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  rows: 3,
  columns: 1,
  width: '100%',
  height: '1rem',
  circle: false
})

const _skeletonClasses = computed(() => [
  'animate-pulse rounded-md bg-muted',
  _props.circle && 'rounded-full'
])
</script>

<template>
  <div :class="['space-y-3', _props.class]">
    <template v-for="row in rows" :key="row">
      <div v-if="columns === 1" :class="_skeletonClasses" :style="{ width, height }" />
      <div v-else class="flex gap-2">
        <div
          v-for="col in columns"
          :key="col"
          :class="_skeletonClasses"
          :style="{ width: `${100 / columns}%`, height }"
        />
      </div>
    </template>
  </div>
</template>
