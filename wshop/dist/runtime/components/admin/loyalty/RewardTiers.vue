<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-semibold text-lg">Reward Tiers</h2>
      <button class="text-sm text-blue-600">+ Add Tier</button>
    </div>
    <div class="space-y-2">
      <div v-for="tier in tiers" :key="tier.id" class="border p-4 rounded flex justify-between items-center">
        <div>
          <p class="font-bold" :style="{ color: tier.color }">{{ tier.name }}</p>
          <p class="text-sm text-gray-600">Minimum Points: {{ tier.minPoints }}</p>
          <p class="text-sm text-gray-600">Benefits: {{ tier.benefits.join(", ") }}</p>
        </div>
        <button class="text-sm">Edit</button>
      </div>
      <p v-if="!tiers || tiers.length === 0" class="text-gray-500">No reward tiers defined.</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tiers: { type: null, required: true }
});
</script>
