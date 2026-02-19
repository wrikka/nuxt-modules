<template>
  <div class="space-y-4">
    <div v-for="zone in zones" :key="zone.id" class="p-4 border rounded-lg">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold">{{ zone.name }}</h3>
          <p class="text-sm text-gray-500">{{ zone.countries.join(", ") }}</p>
        </div>
        <button class="text-sm">Edit</button>
      </div>
      <div class="mt-4 pt-4 border-t">
        <h4 class="font-semibold mb-2">Rates</h4>
        <div v-if="zone.rates.length" class="space-y-2">
          <div v-for="rate in zone.rates" :key="rate.id" class="flex justify-between items-center text-sm">
            <span>{{ rate.name }}</span>
            <span>{{ formatCurrency(rate.price, rate.currency) }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500">No rates for this zone.</p>
        <button class="mt-2 text-sm text-blue-500">Add Rate</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from "~/utils/formatters";
defineProps({
  zones: { type: Array, required: true }
});
</script>
