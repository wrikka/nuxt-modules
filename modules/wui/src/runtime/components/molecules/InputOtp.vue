<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

interface Props {
  modelValue?: string
  length?: number
  disabled?: boolean
  error?: string
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  length: 6
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'complete': [value: string]
}>()

const _inputRefs = ref<HTMLInputElement[]>([])

const _digits = computed({
  get: () => {
    const chars = _props.modelValue.split('')
    return Array.from({ length: _props.length }, (_, i) => chars[i] || '')
  },
  set: (val: string[]) => {
    emit('update:modelValue', val.join(''))
  }
})

const _isComplete = computed(() => {
  return _digits.value.every(d => d.length === 1)
})

watch(_isComplete, (complete) => {
  if (complete) {
    emit('complete', _digits.value.join(''))
  }
})

const _handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '').slice(0, 1)
  
  if (value) {
    const newDigits = [..._digits.value]
    newDigits[index] = value
    _digits.value = newDigits
    
    if (index < _props.length - 1) {
      nextTick(() => {
        _inputRefs.value[index + 1]?.focus()
      })
    }
  }
}

const _handleKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    event.preventDefault()
    const newDigits = [..._digits.value]
    
    if (newDigits[index]) {
      newDigits[index] = ''
      _digits.value = newDigits
    }
    else if (index > 0) {
      newDigits[index - 1] = ''
      _digits.value = newDigits
      _inputRefs.value[index - 1]?.focus()
    }
  }
  else if (event.key === 'ArrowLeft' && index > 0) {
    _inputRefs.value[index - 1]?.focus()
  }
  else if (event.key === 'ArrowRight' && index < _props.length - 1) {
    _inputRefs.value[index + 1]?.focus()
  }
}

const _handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const digits = pastedData.replace(/\D/g, '').slice(0, _props.length).split('')
  
  const newDigits = [..._digits.value]
  digits.forEach((digit, i) => {
    if (i < _props.length) {
      newDigits[i] = digit
    }
  })
  _digits.value = newDigits
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex gap-2">
      <input
        v-for="(_, index) in length"
        :key="index"
        :ref="el => { if (el) _inputRefs[index] = el as HTMLInputElement }"
        v-model="_digits[index]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        :disabled="disabled"
        class="h-12 w-12 rounded-md border border-input bg-background text-center text-lg font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        :class="error && 'border-destructive'"
        @input="_handleInput(index, $event)"
        @keydown="_handleKeydown(index, $event)"
        @paste="_handlePaste"
      />
    </div>
    <WFormError v-if="error" :message="error" />
  </div>
</template>
