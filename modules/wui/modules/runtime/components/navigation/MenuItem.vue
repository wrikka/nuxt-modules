<script setup lang="ts">
import { inject } from 'vue'

interface Props {
  label: string
  icon?: string
  shortcut?: string
  disabled?: boolean
  destructive?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  disabled: false,
  destructive: false
})

const emit = defineEmits<{
  click: []
}>()

const menu = inject<{ close: () => void }>('menu', { close: () => {} })

const _handleClick = () => {
  if (_props.disabled) return
  emit('click')
  menu.close()
}
</script>

<template>
  <button
    :disabled="disabled"
    class="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
    :class="[
      destructive && 'text-destructive hover:bg-destructive hover:text-destructive-foreground',
      _props.class
    ]"
    @click="_handleClick"
  >
    <span v-if="icon" :class="[icon, 'mr-2 h-4 w-4']" />
    <span class="flex-1">{{ label }}</span>
    <span v-if="shortcut" class="ml-2 text-xs tracking-widest opacity-60">
      {{ shortcut }}
    </span>
  </button>
</template>
