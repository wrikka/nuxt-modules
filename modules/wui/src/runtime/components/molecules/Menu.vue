<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from 'vue'

interface Props {
  trigger?: 'click' | 'hover'
  align?: 'start' | 'center' | 'end'
  side?: 'bottom' | 'top' | 'left' | 'right'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  trigger: 'click',
  align: 'start',
  side: 'bottom'
})

const _isOpen = ref(false)
const _menuRef = ref<HTMLElement | null>(null)

const _toggle = () => {
  _isOpen.value = !_isOpen.value
}

const _close = () => {
  _isOpen.value = false
}

provide('menu', {
  close: _close,
  isOpen: _isOpen
})

const _handleClickOutside = (event: MouseEvent) => {
  if (_menuRef.value && !_menuRef.value.contains(event.target as Node)) {
    _close()
  }
}

const _handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    _close()
  }
}

onMounted(() => {
  document.addEventListener('click', _handleClickOutside)
  document.addEventListener('keydown', _handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', _handleClickOutside)
  document.removeEventListener('keydown', _handleKeydown)
})
</script>

<template>
  <div ref="_menuRef" class="relative inline-block">
    <div @click="_toggle">
      <slot name="trigger" :is-open="_isOpen" :toggle="_toggle" />
    </div>
    
    <div
      v-if="_isOpen"
      class="absolute z-50 min-w-[8rem] rounded-md border bg-popover p-1 shadow-md"
      :class="[
        _props.align === 'start' && 'left-0',
        _props.align === 'center' && 'left-1/2 -translate-x-1/2',
        _props.align === 'end' && 'right-0',
        _props.side === 'bottom' && 'top-full mt-1',
        _props.side === 'top' && 'bottom-full mb-1',
        _props.side === 'left' && 'right-full mr-1',
        _props.side === 'right' && 'left-full ml-1',
        _props.class
      ]"
    >
      <slot />
    </div>
  </div>
</template>
