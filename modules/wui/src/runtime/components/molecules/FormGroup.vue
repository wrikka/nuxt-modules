<script setup lang="ts">
import { inject, computed } from 'vue'

interface Props {
  label?: string
  description?: string
  required?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  required: false
})

const form = inject<{
  errors: Record<string, string>
  touched: Record<string, boolean>
}>('form', { errors: {}, touched: {} })

const fieldName = inject<string>('fieldName', '')

const hasError = computed(() => {
  return form.touched[fieldName] && form.errors[fieldName]
})

const errorMessage = computed(() => form.errors[fieldName])

const _classes = computed(() => [
  'space-y-2',
  hasError.value && 'has-error',
  _props.class
])
</script>

<template>
  <div :class="_classes">
    <div v-if="label" class="flex items-center space-x-1">
      <label class="text-sm font-medium">
        {{ label }}
      </label>
      <span v-if="required" class="text-destructive">*</span>
    </div>
    
    <slot :has-error="hasError" />
    
    <p v-if="description && !hasError" class="text-sm text-muted-foreground">
      {{ description }}
    </p>
    
    <p v-if="hasError" class="text-sm text-destructive">
      {{ errorMessage }}
    </p>
  </div>
</template>
