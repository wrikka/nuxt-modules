<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Payment Summary</h2>
    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-600">Subtotal</span>
        <span>${{ subtotal }}</span>
      </div>
            <div class="flex justify-between">
        <span class="text-gray-600">Shipping</span>
        <span>${{ shippingCost }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Taxes</span>
        <span>${{ taxAmount }}</span>
      </div>
      <div class="flex justify-between font-bold text-base border-t pt-2 mt-2">
        <span>Total</span>
        <span>${{ total }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  subtotal: string | number;
  shippingCost: string | number;
  taxAmount: string | number;
  total: string | number;
}>();
</script>
