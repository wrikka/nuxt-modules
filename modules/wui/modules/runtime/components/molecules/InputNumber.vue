<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  step: 1
})

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
}>()

const _classes = computed(() => [
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  _props.error && 'border-destructive'
])

const _onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value === '' ? undefined : Number(target.value)
  emit('update:modelValue', value)
}

const _decrement = () => {
  if (_props.disabled) return
  const current = _props.modelValue ?? 0
  const newValue = Math.max(
    _props.min ?? Number.NEGATIVE_INFINITY,
    current - _props.step
  )
  emit('update:modelValue', newValue)
}

const _increment = () => {
  if (_props.disabled) return
  const current = _props.modelValue ?? 0
  const newValue = Math.min(
    _props.max ?? Number.POSITIVE_INFINITY,
    current + _props.step
  )
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center">
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 border-input bg-background hover:bg-accent"
        :disabled="disabled"
        @click="_decrement"
      >
        <span class="i-lucide-minus h-4 w-4" />
      </button>
      <input
        :class="_classes"
        type="number"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        @input="_onInput"
      />
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-r-md border border-l-0 border-input bg-background hover:bg-accent"
        :disabled="disabled"
        @click="_increment"
      >
        <span class="i-lucide-plus h-4 w-4" />
      </button>
    </div>
    <WFormError v-if="error" :message="error" />
  </div>
</template>
