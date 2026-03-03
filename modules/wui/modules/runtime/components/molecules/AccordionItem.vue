<script setup lang="ts">
import { inject, computed } from 'vue'

interface Props {
  value: string
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const accordion = inject('accordion') as {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
  collapsible: boolean
}

const isOpen = computed(() => accordion.isOpen(props.value))

const _chevronClasses = computed(() => [
  'h-4 w-4 shrink-0 transition-transform duration-200',
  isOpen.value && 'rotate-180'
])

const _onClick = () => {
  if (!props.disabled) {
    accordion.toggle(props.value)
  }
}
</script>

<template>
  <div :class="['border rounded-lg', props.class]">
    <button
      :disabled="props.disabled"
      class="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
      @click="_onClick"
    >
      <slot name="header" />
      <div :class="_chevronClasses">
        <div class="i-lucide-chevron-down" />
      </div>
    </button>
    
    <div
      v-if="isOpen"
      class="overflow-hidden"
    >
      <div class="p-4 pt-0">
        <slot />
      </div>
    </div>
  </div>
</template>
