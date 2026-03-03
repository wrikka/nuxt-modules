<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: boolean
  disabled?: boolean
  required?: boolean
  error?: string
}

const _props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const _isChecked = computed(() => _props.modelValue)

const _classes = computed(() => [
  'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
  _props.error && 'border-destructive'
])

const _thumbClasses = computed(() => [
  'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
])

const _onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center space-x-2">
      <input
        type="checkbox"
        :class="_classes"
        :checked="_isChecked"
        :disabled="_props.disabled"
        :required="_props.required"
        @change="_onChange"
      />
      <span :class="_thumbClasses" />
      <slot />
    </div>
    <p v-if="_props.error" class="text-sm text-destructive">{{ _props.error }}</p>
  </div>
</template>
