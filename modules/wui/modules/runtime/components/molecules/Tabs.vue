<script setup lang="ts">
import { computed, provide } from 'vue'

interface Props {
  modelValue?: string
  orientation?: 'horizontal' | 'vertical'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const activeTab = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

provide('tabs', {
  activeTab,
  orientation: props.orientation
})
</script>

<template>
  <div :class="['w-full', props.class]">
    <slot />
  </div>
</template>
