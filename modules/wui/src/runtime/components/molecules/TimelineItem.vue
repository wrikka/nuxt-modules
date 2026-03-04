<script setup lang="ts">
import { computed } from 'vue'

interface TimelineItemData {
  title: string
  description?: string
  timestamp?: string
  icon?: string
  status?: 'completed' | 'current' | 'pending' | 'error'
}

interface Props {
  item: TimelineItemData
  layout?: 'vertical' | 'horizontal'
  alternate?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  layout: 'vertical',
  alternate: false
})

const _statusConfig = computed(() => ({
  completed: { icon: 'i-lucide-check-circle', color: 'bg-green-500 text-white' },
  current: { icon: 'i-lucide-circle-dot', color: 'bg-primary text-primary-foreground' },
  pending: { icon: 'i-lucide-circle', color: 'bg-muted text-muted-foreground' },
  error: { icon: 'i-lucide-x-circle', color: 'bg-destructive text-destructive-foreground' }
}))

const _status = computed(() => _props.item.status || 'pending')
const _config = computed(() => _statusConfig.value[_status.value])
</script>

<template>
  <div
    :class="[
      'relative flex gap-4',
      layout === 'vertical' ? 'pb-8 last:pb-0' : 'flex-col items-center text-center',
      alternate && layout === 'vertical' && 'flex-row-reverse text-right',
      _props.class
    ]"
  >
    <div
      :class="[
        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
        _config.color
      ]"
    >
      <span :class="[item.icon || _config.icon, 'h-3.5 w-3.5']" />
    </div>
    
    <div :class="['flex-1', layout === 'horizontal' && 'mt-3']">
      <div class="flex items-center gap-2">
        <h4 class="font-medium">{{ item.title }}</h4>
        <span
          v-if="item.timestamp"
          class="text-xs text-muted-foreground"
        >
          {{ item.timestamp }}
        </span>
      </div>
      
      <p v-if="item.description" class="mt-1 text-sm text-muted-foreground">
        {{ item.description }}
      </p>
      
      <slot />
    </div>
  </div>
</template>
