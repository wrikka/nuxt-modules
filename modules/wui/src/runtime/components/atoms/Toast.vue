<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Props {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

const _props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  duration: 5000
})

const emit = defineEmits<{
  close: []
}>()

const isVisible = ref(false)

onMounted(() => {
  isVisible.value = true
  
  if (_props.duration > 0) {
    setTimeout(() => {
      close()
    }, _props.duration)
  }
})

const close = () => {
  isVisible.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}

const _classes = computed(() => {
  const base = 'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all'
  const variants = {
    default: 'border bg-background text-foreground',
    destructive: 'destructive border-destructive bg-destructive text-destructive-foreground',
    success: 'border-green-200 bg-green-50 text-green-800'
  }
  
  return `${base} ${variants[_props.variant]} ${isVisible.value ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`
})

const _iconClasses = computed(() => {
  const icons = {
    default: 'i-lucide-info',
    destructive: 'i-lucide-alert-circle',
    success: 'i-lucide-check-circle'
  }
  return icons[_props.variant]
})
</script>

<template>
  <div :class="_classes">
    <div class="grid gap-1">
      <div v-if="_props.title" class="flex items-center">
        <div :class="_iconClasses" class="h-4 w-4 mr-2" />
        <div class="text-sm font-semibold">{{ _props.title }}</div>
      </div>
      <p v-if="_props.description" class="text-sm opacity-90">
        {{ _props.description }}
      </p>
    </div>
    
    <button
      class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      @click="close"
    >
      <div class="i-lucide-x h-4 w-4" />
    </button>
    
    <button
      v-if="_props.action"
      class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
      @click="_props.action.onClick"
    >
      {{ _props.action.label }}
    </button>
  </div>
</template>
