<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  href?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg'
  disabled?: boolean
  external?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
  external: false
})

const _classes = computed(() => {
  const base = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variants = {
    default: 'text-primary underline-offset-4 hover:underline',
    destructive: 'text-destructive underline-offset-4 hover:underline',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline'
  }
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8'
  }
  
  return `${base} ${variants[_props.variant]} ${sizes[_props.size]} ${_props.class || ''}`
})

const _component = computed(() => {
  return _props.href ? 'a' : 'button'
})

const _attrs = computed(() => {
  if (_props.href) {
    return {
      href: _props.href,
      target: _props.external ? '_blank' : undefined,
      rel: _props.external ? 'noopener noreferrer' : undefined
    }
  }
  return {}
})
</script>

<template>
  <component
    :is="_component"
    :class="_classes"
    :disabled="_props.disabled && !_props.href"
    v-bind="_attrs"
  >
    <slot />
  </component>
</template>
