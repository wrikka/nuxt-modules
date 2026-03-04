<script setup lang="ts">
interface Props {
  status: 'success' | 'error' | 'info' | 'warning'
  title?: string
  description?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  description: undefined,
  icon: undefined
})

const statusConfig = {
  success: {
    icon: 'check-circle',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    iconColor: 'text-green-500'
  },
  error: {
    icon: 'x-circle',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    iconColor: 'text-red-500'
  },
  info: {
    icon: 'info',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    iconColor: 'text-blue-500'
  },
  warning: {
    icon: 'alert-triangle',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    iconColor: 'text-yellow-500'
  }
}

const config = computed(() => statusConfig[props.status])
</script>

<template>
  <div
    class="rounded-lg border p-6"
    :class="[config.bg, config.border]"
  >
    <div class="flex items-center gap-4">
      <span
        class="size-12"
        :class="[config.iconColor, `i-lucide-${icon || config.icon}`]"
      />
      <div>
        <h3 v-if="title" class="font-semibold" :class="config.text">
          {{ title }}
        </h3>
        <p v-if="description" class="mt-1 text-sm" :class="config.text">
          {{ description }}
        </p>
        <slot />
      </div>
    </div>
  </div>
</template>
