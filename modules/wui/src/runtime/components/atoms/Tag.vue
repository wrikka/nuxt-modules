<script setup lang="ts">
interface Props {
  label: string
  removable?: boolean
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  removable: false,
  variant: 'default',
  size: 'md'
})

const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium transition-colors"
    :class="{
      'bg-gray-100 text-gray-800': variant === 'default',
      'bg-blue-100 text-blue-800': variant === 'primary',
      'bg-purple-100 text-purple-800': variant === 'secondary',
      'bg-green-100 text-green-800': variant === 'success',
      'bg-yellow-100 text-yellow-800': variant === 'warning',
      'bg-red-100 text-red-800': variant === 'error',
      'text-xs': size === 'sm',
      'text-sm': size === 'md',
      'text-base': size === 'lg'
    }"
  >
    {{ label }}
    <button
      v-if="removable"
      type="button"
      class="ml-1 rounded-full p-0.5 hover:bg-black/10"
      @click="emit('remove')"
    >
      <span class="i-lucide-x size-3" />
    </button>
  </span>
</template>
