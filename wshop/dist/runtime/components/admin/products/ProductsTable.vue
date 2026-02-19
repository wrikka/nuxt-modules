<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <table class="min-w-full leading-normal">
      <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap">{{ product.name }}</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <span class="relative inline-block px-3 py-1 font-semibold leading-tight rounded-full" :class="getStatusClass(product.status)">
              <span class="relative">{{ product.status }}</span>
            </span>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap">${{ product.price }}</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
            <NuxtLink :to="`/admin/products/${product.id}`" class="text-indigo-600 hover:text-indigo-900">Edit</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { getStatusClass } from "~/shared/utils";
defineProps({
  products: { type: Array, required: true }
});
</script>
