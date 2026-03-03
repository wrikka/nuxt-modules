<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Customer</h2>
    <p>{{ customer?.name }}</p>
    <p class="text-sm text-gray-600">{{ customer?.email }}</p>
    <h3 class="text-lg font-semibold mt-4 mb-2">Shipping Address</h3>
    <address class="not-italic text-sm text-gray-600">
      {{ shippingAddress.street }}<br>
      {{ shippingAddress.city }}, {{ shippingAddress.state }} {{ shippingAddress.zipCode }}<br>
      {{ shippingAddress.country }}
    </address>
  </div>
</template>

<script setup lang="ts">
import type { Customer, Address } from '~~/shared/types';

defineProps<{
  customer: Customer | null;
  shippingAddress: Address;
}>();
</script>
