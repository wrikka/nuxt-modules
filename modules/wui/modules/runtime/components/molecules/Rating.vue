<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  disabled?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  max: 5,
  size: 'md',
  readonly: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [rating: number]
  hover: [rating: number]
}>()

const hoverValue = ref(0)

const _sizeClasses = computed(() => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }
  return sizes[_props.size]
})

const _displayValue = computed(() => {
  return hoverValue.value || _props.modelValue || 0
})

const _onRatingChange = (rating: number) => {
  if (!_props.readonly && !_props.disabled) {
    emit('update:modelValue', rating)
  }
}

const _onHover = (rating: number) => {
  if (!_props.readonly && !_props.disabled) {
    hoverValue.value = rating
    emit('hover', rating)
  }
}

const _onLeave = () => {
  hoverValue.value = 0
}

const _classes = computed(() => [
  'flex items-center space-x-1',
  _props.disabled && 'opacity-50 cursor-not-allowed',
  !_props.readonly && !_props.disabled && 'cursor-pointer',
  _props.class
])
</script>

<template>
  <div
    :class="_classes"
    @mouseleave="_onLeave"
  >
    <button
      v-for="star in _props.max"
      :key="star"
      type="button"
      :disabled="_props.disabled"
      class="p-0.5 transition-colors"
      @click="_onRatingChange(star)"
      @mouseenter="_onHover(star)"
    >
      <div
        :class="[_sizeClasses, {
          'text-yellow-400': star <= _displayValue,
          'text-muted-foreground': star > _displayValue
        }]"
      >
        <div class="i-lucide-star h-full w-full fill-current" />
      </div>
    </button>
  </div>
</template>
