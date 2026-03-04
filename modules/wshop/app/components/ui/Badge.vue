<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  rounded?: 'default' | 'full'
  removable?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  rounded: 'default'
})

const emit = defineEmits<{
  remove: []
}>()

const variantClasses = {
  default: 'bg-secondary-100 text-secondary-800',
  primary: 'bg-primary-100 text-primary-800',
  success: 'bg-success-100 text-success-800',
  warning: 'bg-warning-100 text-warning-800',
  error: 'bg-error-100 text-error-800',
  info: 'bg-blue-100 text-blue-800'
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm'
}

const roundedClasses = {
  default: 'rounded-md',
  full: 'rounded-full'
}
</script>

<template>
  <span
    class="inline-flex items-center font-medium"
    :class="[
      variantClasses[variant],
      sizeClasses[size],
      roundedClasses[rounded]
    ]"
  >
    <slot />
    <button
      v-if="removable"
      type="button"
      class="ml-1.5 inline-flex items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-1"
      :class="size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'"
      aria-label="Remove"
      @click="emit('remove')"
    >
      <span class="sr-only">Remove</span>
      <svg class="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
      </svg>
    </button>
  </span>
</template>
