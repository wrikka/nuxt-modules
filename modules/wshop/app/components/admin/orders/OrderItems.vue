<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Items</h2>
    <div class="divide-y divide-gray-200">
      <div v-for="item in items" :key="item.id" class="py-4 flex items-center">
        <p class="font-semibold text-gray-800 w-12 text-center">{{ item.quantity }}x</p>
        <div class="flex-grow ml-4">
          <p class="font-semibold">{{ item.product?.name || 'Product not found' }}</p>
          <p class="text-sm text-gray-500">SKU: {{ item.variant?.sku || 'N/A' }}</p>
        </div>
        <p class="text-right">${{ item.price }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderItem } from '~~/shared/types';

defineProps<{
  items: OrderItem[];
}>();
</script>
