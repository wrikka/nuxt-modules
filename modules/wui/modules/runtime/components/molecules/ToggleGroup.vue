<script setup lang="ts">
import { ref, provide, computed } from 'vue'

interface Props {
  modelValue?: string | string[]
  type?: 'single' | 'multiple'
  disabled?: boolean
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  type: 'single',
  disabled: false,
  variant: 'default',
  size: 'default'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const selectedValue = ref(_props.modelValue || (_props.type === 'multiple' ? [] : ''))

const isSelected = (value: string) => {
  if (_props.type === 'multiple') {
    return Array.isArray(selectedValue.value) && selectedValue.value.includes(value)
  }
  return selectedValue.value === value
}

const select = (value: string) => {
  if (_props.disabled) return
  
  if (_props.type === 'multiple') {
    const current = Array.isArray(selectedValue.value) ? selectedValue.value : []
    const index = current.indexOf(value)
    
    if (index > -1) {
      selectedValue.value = current.filter(v => v !== value)
    } else {
      selectedValue.value = [...current, value]
    }
  } else {
    selectedValue.value = selectedValue.value === value ? '' : value
  }
  
  emit('update:modelValue', selectedValue.value)
}

provide('toggleGroup', {
  isSelected,
  select,
  disabled: _props.disabled,
  variant: _props.variant,
  size: _props.size
})

const _classes = computed(() => {
  const base = 'inline-flex items-center rounded-md'
  const variants = {
    default: 'bg-transparent',
    outline: 'border border-input'
  }
  
  return `${base} ${variants[_props.variant]} ${_props.class || ''}`
})
</script>

<template>
  <div :class="_classes" role="group">
    <slot />
  </div>
</template>
