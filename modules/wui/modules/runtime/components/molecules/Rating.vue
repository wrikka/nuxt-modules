<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  half?: boolean
  clearable?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  max: 5,
  size: 'md',
  readonly: false,
  half: false,
  clearable: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'change': [value: number]
}>()

const _sizeClasses = computed(() => ({
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
}))

const _hoverValue = ref(0)

import { ref } from 'vue'

const _displayValue = computed(() => 
  _hoverValue.value || _props.modelValue
)

const _setValue = (value: number) => {
  if (_props.readonly) return
  
  const newValue = _props.clearable && _props.modelValue === value ? 0 : value
  emit('update:modelValue', newValue)
  emit('change', newValue)
  _hoverValue.value = 0
}

const _onMouseEnter = (index: number) => {
  if (!_props.readonly) {
    _hoverValue.value = index + 1
  }
}

const _onMouseLeave = () => {
  _hoverValue.value = 0
}
</script>

<template>
  <div
    :class="['inline-flex items-center gap-1', _props.class]"
    @mouseleave="_onMouseLeave"
  >
    <button
      v-for="index in max"
      :key="index"
      type="button"
      :disabled="readonly"
      :class="[
        'transition-colors focus:outline-none',
        readonly && 'cursor-default',
        !readonly && 'cursor-pointer hover:scale-110'
      ]"
      @click="_setValue(index)"
      @mouseenter="_onMouseEnter(index - 1)"
    >
      <span
        :class="[
          index <= _displayValue ? 'i-lucide-star text-yellow-400 fill-yellow-400' : 'i-lucide-star text-muted-foreground',
          _sizeClasses[size]
        ]"
      />
    </button>
  </div>
</template>
