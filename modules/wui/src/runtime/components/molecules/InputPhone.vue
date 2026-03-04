<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  format?: 'th' | 'us' | 'raw'
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  format: 'th'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isFocused = ref(false)

const _formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '')
  
  if (_props.format === 'th') {
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    if (digits.length <= 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }
  
  if (_props.format === 'us') {
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }
  
  return digits
}

const _unformatPhone = (value: string): string => {
  return value.replace(/\D/g, '')
}

const _displayValue = computed(() => {
  return _formatPhone(_props.modelValue || '')
})

const _classes = computed(() => [
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  _props.error && 'border-destructive',
  isFocused.value && 'ring-2 ring-ring ring-offset-2'
])

const _onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const rawValue = _unformatPhone(target.value)
  emit('update:modelValue', rawValue)
}
</script>

<template>
  <div class="space-y-2">
    <div class="relative flex items-center">
      <span class="i-lucide-phone absolute left-3 h-4 w-4 text-muted-foreground" />
      <input
        :class="[_classes, 'pl-10']"
        type="tel"
        :value="_displayValue"
        :placeholder="placeholder || '081-234-5678'"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        @input="_onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </div>
    <WFormError v-if="error" :message="error" />
  </div>
</template>
