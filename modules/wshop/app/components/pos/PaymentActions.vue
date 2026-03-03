<script setup lang="ts">
import type { PaymentMethod, CartItem } from '~~/shared/types'

defineProps<{
  paymentMethods: PaymentMethod[]
  selectedPaymentMethod: string | null
  cartItems: CartItem[]
}>()

const emit = defineEmits<{
  (e: 'update:selectedPaymentMethod', methodId: string): void
  (e: 'process-payment'): void
  (e: 'suspend-sale'): void
}>()
</script>

<template>
  <div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">วิธีการชำระเงิน</label>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="method in paymentMethods"
          :key="method.id"
          @click="emit('update:selectedPaymentMethod', method.id)"
          :class="[
            'p-3 rounded-lg border-2 transition-colors',
            selectedPaymentMethod === method.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <Icon :name="method.icon" class="w-5 h-5 mx-auto mb-1" />
          <span class="text-xs">{{ method.name }}</span>
        </button>
      </div>
    </div>

    <div class="space-y-2">
      <button
        @click="emit('process-payment')"
        :disabled="cartItems.length === 0 || !selectedPaymentMethod"
        class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ชำระเงิน
      </button>
      <button
        @click="emit('suspend-sale')"
        :disabled="cartItems.length === 0"
        class="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        พักการขาย
      </button>
    </div>
  </div>
</template>
