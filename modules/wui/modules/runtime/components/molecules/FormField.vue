<script setup lang="ts">
import { computed, provide } from 'vue'

interface Props {
  name: string
  label?: string
  description?: string
  error?: string
  required?: boolean
  disabled?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false
})

const hasError = computed(() => !!_props.error)

provide('formField', {
  name: _props.name,
  hasError,
  disabled: _props.disabled,
  required: _props.required
})

const _classes = computed(() => [
  'space-y-2',
  _props.class
])
</script>

<template>
  <div :class="_classes">
    <div v-if="label" class="flex items-center space-x-1">
      <Label :for="name" class="text-sm font-medium">
        {{ label }}
      </Label>
      <span v-if="required" class="text-destructive">*</span>
    </div>
    
    <slot />
    
    <p v-if="description && !error" class="text-sm text-muted-foreground">
      {{ description }}
    </p>
    
    <p v-if="error" class="text-sm text-destructive">
      {{ error }}
    </p>
  </div>
</template>
