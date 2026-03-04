<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number
  prefix?: string
  suffix?: string
  trend?: number
  trendLabel?: string
  decimals?: number
}

const props = withDefaults(defineProps<Props>(), {
  prefix: '',
  suffix: '',
  trend: 0,
  trendLabel: 'vs last period',
  decimals: 0
})

const formattedValue = computed(() => {
  return props.value.toFixed(props.decimals)
})

const trendPositive = computed(() => props.trend > 0)
const trendNeutral = computed(() => props.trend === 0)
</script>

<template>
  <div>
    <div class="flex items-baseline gap-1">
      <span class="text-3xl font-bold">{{ prefix }}{{ formattedValue }}{{ suffix }}</span>
    </div>
    <div v-if="trend !== 0 || $slots.trend" class="mt-1 flex items-center gap-1 text-sm">
      <slot name="trend">
        <span
          class="flex items-center gap-0.5"
          :class="trendPositive ? 'text-green-600' : 'text-red-600'"
        >
          <span
            class="size-4"
            :class="trendPositive ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
          />
          {{ Math.abs(trend) }}%
        </span>
        <span class="text-gray-400">{{ trendLabel }}</span>
      </slot>
    </div>
  </div>
</template>
