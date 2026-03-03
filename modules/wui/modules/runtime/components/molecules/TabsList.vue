<script setup lang="ts">
import { inject, computed } from 'vue'

interface Props {
  class?: string
}

const _props = defineProps<Props>()

const tabs = inject('tabs') as {
  activeTab: { value: string }
  orientation: 'horizontal' | 'vertical'
}

const _orientationClasses = computed(() => {
  return tabs.orientation === 'horizontal' 
    ? 'h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground'
    : 'h-full w-48 flex-col items-start justify-start rounded-md bg-muted p-1 text-muted-foreground'
})
</script>

<template>
  <div :class="[_orientationClasses, _props.class]">
    <slot />
  </div>
</template>
