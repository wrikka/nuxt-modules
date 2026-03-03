<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  validateOnBlur?: boolean
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  validateOnBlur: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'validate': [isValid: boolean]
}>()

const _emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const _isValidEmail = (email: string): boolean => {
  return _emailRegex.test(email)
}

const _classes = computed(() => [
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  _props.error && 'border-destructive',
  _props.modelValue && !_props.error && _isValidEmail(_props.modelValue) && 'border-green-500'
])

const _onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const _onBlur = () => {
  if (_props.validateOnBlur && _props.modelValue) {
    emit('validate', _isValidEmail(_props.modelValue))
  }
}
</script>

<template>
  <div class="space-y-2">
    <div class="relative flex items-center">
      <span class="i-lucide-mail absolute left-3 h-4 w-4 text-muted-foreground" />
      <input
        :class="[_classes, 'pl-10']"
        type="email"
        :value="modelValue"
        :placeholder="placeholder || 'email@example.com'"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        @input="_onInput"
        @blur="_onBlur"
      />
      <span
        v-if="modelValue && !error && _isValidEmail(modelValue)"
        class="i-lucide-check absolute right-3 h-4 w-4 text-green-500"
      />
    </div>
    <WFormError v-if="error" :message="error" />
  </div>
</template>
