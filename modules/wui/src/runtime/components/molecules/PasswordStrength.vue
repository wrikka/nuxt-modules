<script setup lang="ts">
import { computed } from 'vue'

interface Requirement {
  label: string
  regex: RegExp
  min?: number
}

interface Props {
  password: string
  requirements?: Requirement[]
}

const props = withDefaults(defineProps<Props>(), {
  requirements: () => [
    { label: 'At least 8 characters', regex: /.{8,}/ },
    { label: 'One uppercase letter', regex: /[A-Z]/ },
    { label: 'One lowercase letter', regex: /[a-z]/ },
    { label: 'One number', regex: /\d/ },
    { label: 'One special character', regex: /[!@#$%^&*(),.?":{}|<>]/ }
  ]
})

const strength = computed(() => {
  return props.requirements.filter(req => req.regex.test(props.password)).length
})

const strengthLabel = computed(() => {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  return labels[strength.value] || 'Very Weak'
})

const strengthColor = computed(() => {
  const colors = ['bg-red-500', 'bg-red-400', 'bg-yellow-400', 'bg-yellow-500', 'bg-green-400', 'bg-green-500']
  return colors[strength.value] || 'bg-gray-200'
})

const strengthPercent = computed(() => {
  return (strength.value / props.requirements.length) * 100
})
</script>

<template>
  <div class="space-y-2">
    <div class="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
      <div
        class="h-full transition-all duration-300"
        :class="strengthColor"
        :style="{ width: `${strengthPercent}%` }"
      />
    </div>
    <div class="flex items-center justify-between text-sm">
      <span class="text-gray-600">Strength: {{ strengthLabel }}</span>
      <span class="text-gray-400">{{ strength }}/{{ requirements.length }}</span>
    </div>
    <ul class="space-y-1 text-sm">
      <li
        v-for="req in requirements"
        :key="req.label"
        class="flex items-center gap-2"
        :class="req.regex.test(password) ? 'text-green-600' : 'text-gray-400'"
      >
        <span
          class="size-4"
          :class="req.regex.test(password) ? 'i-lucide-check-circle' : 'i-lucide-circle'"
        />
        {{ req.label }}
      </li>
    </ul>
  </div>
</template>
