<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Loyalty & Rewards Program</h1>

    <div v-if="pendingProgram">
      <p>Loading loyalty program...</p>
    </div>
    <div v-else-if="errorProgram">
      <p class="text-red-500">Failed to load loyalty program.</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <AdminLoyaltyRewardTiers :tiers="program?.tiers || []" />
        <AdminLoyaltyCustomerPointsList :customers="customers || []" :pending="pendingCustomers" :error="errorCustomers" />
      </div>
      <div>
        <AdminLoyaltyLoyaltySettings :program="program" @save="saveProgram" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoyalty } from '~/composables/useLoyalty';

const { 
  program, 
  pendingProgram, 
  errorProgram, 
  customers, 
  pendingCustomers, 
  errorCustomers, 
  saveProgram 
} = useLoyalty();
</script>
