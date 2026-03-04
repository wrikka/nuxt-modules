<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  value: string | number
  disabled?: boolean
  required?: boolean
  error?: string
}

const _props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const _isChecked = computed(() => _props.modelValue === _props.value)

const _classes = computed(() => [
  'peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
  _props.error && 'border-destructive'
])

const _onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    emit('update:modelValue', _props.value)
  }
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center space-x-2">
      <input
        type="radio"
        :class="_classes"
        :checked="_isChecked"
        :disabled="_props.disabled"
        :required="_props.required"
        @change="_onChange"
      />
      <slot />
    </div>
    <p v-if="_props.error" class="text-sm text-destructive">{{ _props.error }}</p>
  </div>
</template>
