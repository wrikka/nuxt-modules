<script setup lang="ts">
import { ref, provide, } from 'vue'

interface Props {
  modelValue?: string | string[]
  multiple?: boolean
  collapsible?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  collapsible: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const openItems = ref<string[]>([])

const isOpen = (value: string) => {
  return openItems.value.includes(value)
}

const toggle = (value: string) => {
  const index = openItems.value.indexOf(value)
  
  if (props.multiple) {
    if (index > -1) {
      openItems.value.splice(index, 1)
    } else {
      openItems.value.push(value)
    }
  } else {
    if (index > -1) {
      openItems.value = []
    } else {
      openItems.value = [value]
    }
  }
  
  emit('update:modelValue', props.multiple ? openItems.value : openItems.value[0] || '')
}

provide('accordion', {
  isOpen,
  toggle,
  collapsible: props.collapsible
})
</script>

<template>
  <div :class="['space-y-1', props.class]">
    <slot />
  </div>
</template>
