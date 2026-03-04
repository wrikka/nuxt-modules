<script setup lang="ts">
interface Props {
  label: string
  value: number | string
  prefix?: string
  suffix?: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  prefix: '',
  suffix: '',
  variant: 'default',
  size: 'md'
})

const variantClasses = {
  default: 'text-gray-900',
  primary: 'text-blue-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600'
}

const sizeClasses = {
  sm: { label: 'text-xs', value: 'text-lg' },
  md: { label: 'text-sm', value: 'text-2xl' },
  lg: { label: 'text-base', value: 'text-4xl' }
}
</script>

<template>
  <div class="text-center">
    <div class="text-gray-500" :class="sizeClasses[size].label">{{ label }}</div>
    <div class="font-semibold" :class="[sizeClasses[size].value, variantClasses[variant]]">
      {{ prefix }}{{ value }}{{ suffix }}
    </div>
  </div>
</template>
