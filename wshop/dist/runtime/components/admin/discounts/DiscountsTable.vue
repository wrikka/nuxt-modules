<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <table class="min-w-full leading-normal">
      <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Value</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usage</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="discount in discounts" :key="discount.id">
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap font-mono">{{ discount.code }}</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap">{{ discount.type }}</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap">
              {{ discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}` }}
            </p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap">{{ discount.usageCount }} / {{ discount.usageLimit || "\u221E" }}</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <span :class="statusClass(discount.isActive)" class="relative inline-block px-3 py-1 font-semibold leading-tight rounded-full">
              <span class="relative">{{ discount.isActive ? "Active" : "Inactive" }}</span>
            </span>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
            <NuxtLink :to="`/admin/discounts/${discount.id}`" class="text-indigo-600 hover:text-indigo-900">Edit</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  discounts: { type: Array, required: true }
});
const statusClass = (isActive) => {
  return isActive ? "bg-green-200 text-green-900" : "bg-gray-200 text-gray-900";
};
</script>
