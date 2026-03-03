<template>
  <div v-if="cart" class="bg-white p-6 rounded-lg shadow-md h-fit">
    <h2 class="text-xl font-bold border-b pb-4 mb-4">Order Summary</h2>
    <div class="space-y-2">
      <div class="flex justify-between">
        <span>Subtotal ({{ itemCount }} items)</span>
        <span>${{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between">
        <span>Shipping</span>
        <span class="text-gray-500">Calculated at checkout</span>
      </div>
    </div>
    <div class="border-t mt-4 pt-4">
      <div class="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>${{ subtotal.toFixed(2) }}</span>
      </div>
    </div>
    <div class="mt-6 space-y-4">
      <NuxtLink to="/one-page-checkout" class="block w-full text-center bg-black text-white font-bold py-3 px-6 rounded-lg">Proceed to Checkout</NuxtLink>
          </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart';

const { cart, itemCount, subtotal } = useCart();
</script>
