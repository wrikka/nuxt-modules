<script setup lang="ts">
import type { PaymentMethod } from '~~/shared/types'

interface Props {
  modelValue: string
  methods: PaymentMethod[]
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'select', method: PaymentMethod): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedMethod = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const getMethodIcon = (type: PaymentMethod['type']) => {
  switch (type) {
    case 'card':
      return 'mdi:credit-card'
    case 'qr':
      return 'mdi:cellphone'
    case 'transfer':
      return 'mdi:wallet'
    case 'cash':
      return 'mdi:currency-usd'
    default:
      return 'mdi:wallet'
  }
}

const selectMethod = (method: PaymentMethod) => {
  selectedMethod.value = method.id
  emit('select', method)
}
</script>

<template>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div
      v-for="method in methods.filter(m => m.enabled)"
      :key="method.id"
      @click="!disabled && selectMethod(method)"
      :class="[
        'p-4 rounded-lg border-2 cursor-pointer transition-all',
        selectedMethod === method.id
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 bg-white',
        disabled && 'opacity-50 cursor-not-allowed'
      ]"
    >
      <Icon 
        :name="getMethodIcon(method.type)" 
        class="w-6 h-6 mx-auto mb-2"
        :class="selectedMethod === method.id ? 'text-blue-600' : 'text-gray-600'"
      />
      <div class="text-center">
        <p class="text-sm font-medium">{{ method.name }}</p>
      </div>
    </div>
  </div>

</template>
