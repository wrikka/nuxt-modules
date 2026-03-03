<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  open?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  'update:open': [open: boolean]
}>()

const isOpen = ref(props.open)

watch(() => props.open, (newValue) => {
  isOpen.value = newValue
})

watch(isOpen, (newValue) => {
  emit('update:open', newValue)
})

const _toggle = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const _chevronClasses = computed(() => [
  'h-4 w-4 shrink-0 transition-transform duration-200',
  isOpen.value && 'rotate-180'
])
</script>

<template>
  <div class="space-y-2">
    <slot name="trigger" :open="isOpen" :toggle="_toggle">
      <button
        :disabled="props.disabled"
        class="flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
        @click="_toggle"
      >
        <slot name="trigger-content" />
        <div :class="_chevronClasses">
          <div class="i-lucide-chevron-down" />
        </div>
      </button>
    </slot>
    
    <div
      v-if="isOpen"
      class="overflow-hidden"
    >
      <div class="px-4 py-2 text-sm">
        <slot />
      </div>
    </div>
  </div>
</template>
