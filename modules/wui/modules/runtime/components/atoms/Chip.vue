<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  closable?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  closable: false
})

const emit = defineEmits<{
  close: []
}>()

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }
  return sizes[_props.size]
})

const variantClasses = computed(() => {
  const variants = {
    default: 'bg-background text-foreground border border-border hover:bg-accent',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    success: 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
  }
  return variants[_props.variant]
})

const _classes = computed(() => [
  'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
  sizeClasses.value,
  variantClasses.value,
  _props.class
])

const _onClose = () => {
  emit('close')
}
</script>

<template>
  <div :class="_classes">
    <slot />
    <button
      v-if="closable"
      type="button"
      class="rounded-full opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      @click="onClose"
    >
      <div class="i-lucide-x h-3 w-3" />
    </button>
  </div>
</template>
