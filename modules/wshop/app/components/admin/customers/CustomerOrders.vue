<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Recent Orders</h2>
    <div v-if="orders && orders.length > 0">
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <NuxtLink :to="`/admin/orders/${order.id}`" class="text-blue-500 hover:underline font-mono">{{ order.id.substring(0, 8) }}</NuxtLink>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ formatDate(order.createdAt) }}</td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${{ order.total }}</td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ order.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center py-8">
      <p class="text-gray-500">This customer has no orders yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~~/shared/utils';
import type { Order } from '~~/shared/types';

defineProps<{
  orders: Order[];
}>();
</script>
