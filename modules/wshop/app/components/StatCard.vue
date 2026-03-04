<script setup lang="ts">
import { computed } from 'vue'

interface Stat {
  name: string
  value: string | number
  change?: string
  icon?: string
}

const props = defineProps<{
  stat: Stat
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  loading?: boolean
}>()

const variantClasses = {
  default: 'bg-white border-secondary-200',
  primary: 'bg-primary-50 border-primary-200',
  success: 'bg-success-50 border-success-200',
  warning: 'bg-warning-50 border-warning-200',
  error: 'bg-error-50 border-error-200'
}

const iconBgClasses = {
  default: 'bg-primary-100 text-primary-600',
  primary: 'bg-primary-200 text-primary-700',
  success: 'bg-success-200 text-success-700',
  warning: 'bg-warning-200 text-warning-700',
  error: 'bg-error-200 text-error-700'
}

const changeType = computed(() => {
  if (!props.stat.change) return 'neutral'
  if (props.stat.change.startsWith('+')) return 'positive'
  if (props.stat.change.startsWith('-')) return 'negative'
  return 'neutral'
})

const changeClasses = {
  positive: 'text-success-600',
  negative: 'text-error-600',
  neutral: 'text-secondary-500'
}
</script>

<template>
  <article
    class="relative overflow-hidden rounded-xl border p-6 transition-all duration-200 hover:shadow-md"
    :class="variantClasses[variant || 'default']"
    role="article"
    :aria-label="`${stat.name} statistic`"
  >
    <WShopSkeleton v-if="loading" :lines="2" :avatar="true" />
    
    <template v-else>
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium text-secondary-600">
            {{ stat.name }}
          </p>
          <p class="mt-2 text-3xl font-bold tracking-tight text-secondary-900">
            {{ stat.value }}
          </p>
          <div
            v-if="stat.change"
            class="mt-2 flex items-center text-sm"
            :class="changeClasses[changeType]"
          >
            <span aria-hidden="true">
              {{ changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '→' }}
            </span>
            <span class="ml-1" aria-label="Change from last period">
              {{ stat.change }}
            </span>
            <span class="ml-2 text-secondary-400">vs last period</span>
          </div>
        </div>
        
        <div
          v-if="stat.icon"
          class="flex h-12 w-12 items-center justify-center rounded-lg"
          :class="iconBgClasses[variant || 'default']"
          aria-hidden="true"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon" />
          </svg>
        </div>
      </div>
    </template>
  </article>
</template>
