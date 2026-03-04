<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  disabled?: boolean
  initialFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  initialFocus: false
})

const container = ref<HTMLElement>()
const previousActiveElement = ref<HTMLElement>()

const getFocusableElements = (): HTMLElement[] => {
  if (!container.value) return []
  const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  return Array.from(container.value.querySelectorAll(selector))
    .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')) as HTMLElement[]
}

const trapFocus = (e: KeyboardEvent) => {
  if (props.disabled || e.key !== 'Tab') return
  
  const focusable = getFocusableElements()
  if (focusable.length === 0) return
  
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

onMounted(() => {
  previousActiveElement.value = document.activeElement as HTMLElement
  if (props.initialFocus) {
    const focusable = getFocusableElements()
    focusable[0]?.focus()
  }
  container.value?.addEventListener('keydown', trapFocus)
})

onUnmounted(() => {
  container.value?.removeEventListener('keydown', trapFocus)
  previousActiveElement.value?.focus()
})
</script>

<template>
  <div ref="container">
    <slot />
  </div>
</template>
