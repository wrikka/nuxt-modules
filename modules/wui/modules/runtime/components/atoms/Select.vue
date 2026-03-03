<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  options: Array<{ value: string | number; label: string }>
}

const _props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const isOpen = ref(false)
const _selectedOption = computed(() => 
  _props.options.find(option => option.value === _props.modelValue)
)

const _classes = computed(() => [
  'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  _props.error && 'border-destructive'
])

const _selectOption = (value: string | number) => {
  emit('update:modelValue', value)
  isOpen.value = false
}
</script>

<template>
  <div class="space-y-2">
    <div class="relative">
      <button
        :class="_classes"
        :disabled="_props.disabled"
        @click="isOpen = !isOpen"
      >
        <span v-if="_selectedOption">{{ _selectedOption.label }}</span>
        <span v-else class="text-muted-foreground">{{ _props.placeholder }}</span>
        <div class="i-lucide-chevron-down h-4 w-4 opacity-50" />
      </button>
      
      <div
        v-if="isOpen"
        class="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      >
        <div
          v-for="option in _props.options"
          :key="option.value"
          class="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          @click="_selectOption(option.value)"
        >
          <span>{{ option.label }}</span>
        </div>
      </div>
    </div>
    <p v-if="_props.error" class="text-sm text-destructive">{{ _props.error }}</p>
  </div>
</template>
