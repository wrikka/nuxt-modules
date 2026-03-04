<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'destructive'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const _classes = computed(() => {
  const base = 'relative w-full rounded-lg border p-4'
  const variants = {
    default: 'bg-background text-foreground',
    destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive'
  }
  
  return `${base} ${variants[_props.variant]} ${_props.class || ''}`
})

const _iconClasses = computed(() => {
  const icons = {
    default: 'i-lucide-info',
    destructive: 'i-lucide-alert-circle'
  }
  return icons[_props.variant]
})
</script>

<template>
  <div :class="_classes" role="alert">
    <div :class="_iconClasses" class="absolute left-4 top-4 h-4 w-4" />
    <div class="pl-7">
      <h3 class="mb-1 font-medium leading-none tracking-tight">
        <slot name="title" />
      </h3>
      <div class="text-sm [&_p]:leading-relaxed">
        <slot />
      </div>
    </div>
  </div>
</template>
