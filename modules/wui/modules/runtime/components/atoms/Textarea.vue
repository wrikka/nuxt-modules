<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  rows?: number
  error?: string
}

const _props = withDefaults(defineProps<Props>(), {
  rows: 3
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const _classes = computed(() => [
  'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  _props.error && 'border-destructive'
])

const _onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="space-y-2">
    <textarea
      :class="_classes"
      :value="_props.modelValue"
      :placeholder="_props.placeholder"
      :disabled="_props.disabled"
      :readonly="_props.readonly"
      :required="_props.required"
      :rows="_props.rows"
      @input="_onInput"
    />
    <p v-if="_props.error" class="text-sm text-destructive">{{ _props.error }}</p>
  </div>
</template>
