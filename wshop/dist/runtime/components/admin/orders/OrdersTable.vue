<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <table class="min-w-full leading-normal">
      <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Status</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Status</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap font-mono">{{ order.id.substring(0, 8) }}</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap">{{ order.customer?.name || "Guest" }}</p>
            <p class="text-gray-600 whitespace-no-wrap text-xs">{{ order.customer?.email }}</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap">{{ formatDate(order.createdAt) }}</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap">${{ order.total }}</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <span :class="getStatusClass(order.paymentStatus)" class="relative inline-block px-3 py-1 font-semibold leading-tight rounded-full">
              <span class="relative">{{ order.paymentStatus }}</span>
            </span>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <span :class="getStatusClass(order.status)" class="relative inline-block px-3 py-1 font-semibold leading-tight rounded-full">
              <span class="relative">{{ order.status }}</span>
            </span>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
            <NuxtLink :to="`/admin/orders/${order.id}`" class="text-indigo-600 hover:text-indigo-900">View</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { formatDate, getStatusClass } from "~/shared/utils";
defineProps({
  orders: { type: Array, required: true }
});
</script>
