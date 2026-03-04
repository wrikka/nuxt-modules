<script setup lang="ts">
import { computed } from 'vue'

interface TimelineItem {
  title: string
  description?: string
  timestamp?: string
  icon?: string
  status?: 'completed' | 'current' | 'pending' | 'error'
}

interface Props {
  items: TimelineItem[]
  layout?: 'vertical' | 'horizontal'
  alternate?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  layout: 'vertical',
  alternate: false
})

const _classes = computed(() => [
  'relative',
  _props.layout === 'vertical' 
    ? 'space-y-0' 
    : 'flex items-start gap-8'
])
</script>

<template>
  <div :class="[_classes, _props.class]">
    <div
      v-if="layout === 'vertical'"
      class="absolute left-3 top-0 bottom-0 w-px bg-border"
    />
    
    <slot>
      <WTimelineItem
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        :layout="layout"
        :alternate="alternate && index % 2 === 1"
      />
    </slot>
  </div>
</template>
