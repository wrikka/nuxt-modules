<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  minLength?: number
  showStrengthIndicator?: boolean
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  showStrengthIndicator: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const _showPassword = ref(false)

const _passwordStrength = computed(() => {
  const password = _props.modelValue || ''
  let score = 0
  
  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  
  return score
})

const _strengthText = computed(() => {
  const texts = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  return texts[_passwordStrength.value] || 'Weak'
})

const _strengthColor = computed(() => {
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
  return colors[_passwordStrength.value] || 'bg-red-500'
})

const _classes = computed(() => [
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  _props.error && 'border-destructive'
])

const _onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const _toggleVisibility = () => {
  _showPassword.value = !_showPassword.value
}
</script>

<template>
  <div class="space-y-2">
    <div class="relative flex items-center">
      <input
        :class="[_classes, 'pr-10']"
        :type="_showPassword ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder || 'Enter password'"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :minlength="minLength"
        @input="_onInput"
      />
      <button
        type="button"
        class="absolute right-3 p-1 hover:bg-accent rounded"
        :tabindex="-1"
        @click="_toggleVisibility"
      >
        <span
          :class="_showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          class="h-4 w-4 text-muted-foreground"
        />
      </button>
    </div>
    
    <div v-if="showStrengthIndicator && modelValue" class="space-y-1">
      <div class="flex h-1.5 gap-1">
        <div
          v-for="i in 4"
          :key="i"
          class="flex-1 rounded-full transition-colors"
          :class="i <= _passwordStrength + 1 ? _strengthColor : 'bg-muted'"
        />
      </div>
      <p class="text-xs text-muted-foreground">{{ _strengthText }}</p>
    </div>
    
    <WFormError v-if="error" :message="error" />
  </div>
</template>
