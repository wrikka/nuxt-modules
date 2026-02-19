<script setup>
defineProps({
  paymentMethods: { type: Array, required: true },
  selectedPaymentMethod: { type: [String, null], required: true },
  cartItems: { type: Array, required: true }
});
const emit = defineEmits(["update:selectedPaymentMethod", "process-payment", "suspend-sale"]);
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
  selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
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
