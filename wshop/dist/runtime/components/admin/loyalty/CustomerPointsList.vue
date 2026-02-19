<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="font-semibold text-lg mb-4">Customer Points</h2>
    <div v-if="pending">
      <p>Loading customers...</p>
    </div>
    <div v-else-if="error">
      <p class="text-red-500">Failed to load customer points.</p>
    </div>
    <div v-else-if="!customers || customers.length === 0">
      <p class="text-gray-500">No customers found in the loyalty program.</p>
    </div>
    <div v-else>
      <!-- Basic list, could be a table -->
      <ul>
        <li v-for="customer in customers" :key="customer.customerId" class="flex justify-between py-2 border-b">
          <span>Customer ID: {{ customer.customerId }}</span>
          <span class="font-medium">{{ customer.currentPoints }} points</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  customers: { type: Array, required: true },
  pending: { type: Boolean, required: true },
  error: { type: null, required: true }
});
</script>
