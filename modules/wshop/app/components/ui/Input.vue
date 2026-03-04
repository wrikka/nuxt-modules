<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  hint?: string
  autocomplete?: string
  ariaLabel?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  id: () => `input-${Math.random().toString(36).substr(2, 9)}`
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}>()

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-secondary-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-error-500" aria-hidden="true">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :autocomplete="autocomplete"
      :aria-label="ariaLabel || label"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
      class="block w-full rounded-lg border-secondary-300 shadow-sm transition-colors duration-200 focus:border-primary-500 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed min-h-[44px]"
      :class="[
        sizeClasses[size],
        error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''
      ]"
      @input="onInput"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
      @keydown="emit('keydown', $event)"
    >
    <p
      v-if="hint && !error"
      :id="`${id}-hint`"
      class="mt-1 text-sm text-secondary-500"
    >
      {{ hint }}
    </p>
    <p
      v-if="error"
      :id="`${id}-error`"
      class="mt-1 text-sm text-error-600"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
