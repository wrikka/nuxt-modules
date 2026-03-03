<script setup lang="ts">
import { inject, computed } from 'vue'

interface Props {
  value: string
  disabled?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const tabs = inject('tabs') as {
  activeTab: { value: string }
  orientation: 'horizontal' | 'vertical'
}

const isActive = computed(() => tabs.activeTab.value === _props.value)

const _classes = computed(() => {
  const base = 'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  const active = 'bg-background text-foreground shadow-sm'
  const inactive = 'text-muted-foreground hover:bg-background/50'
  
  return `${base} ${isActive.value ? active : inactive} ${_props.class || ''}`
})

const _onClick = () => {
  if (!_props.disabled) {
    tabs.activeTab.value = _props.value
  }
}
</script>

<template>
  <button
    :class="_classes"
    :disabled="_props.disabled"
    @click="_onClick"
  >
    <slot />
  </button>
</template>
