<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})

const variantClasses = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
  outline: 'border border-border bg-surface text-surface-foreground hover:border-border-hover',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
}
</script>

<template>
  <button
    class="rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-focus disabled:opacity-50"
    :class="[variantClasses[props.variant], sizeClasses[props.size]]"
  >
    <slot />
  </button>
</template>
