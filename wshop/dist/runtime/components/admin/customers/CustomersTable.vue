<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <table class="min-w-full leading-normal">
      <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined Date</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer.id">
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap">{{ customer.name || "N/A" }}</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap">{{ customer.email }}</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap">{{ customer.phone || "N/A" }}</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap">{{ formatDate(customer.createdAt) }}</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
            <NuxtLink :to="`/admin/customers/${customer.id}`" class="text-indigo-600 hover:text-indigo-900">View</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { formatDate } from "~/shared/utils";
defineProps({
  customers: { type: Array, required: true }
});
</script>
