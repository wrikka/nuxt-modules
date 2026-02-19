<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="font-semibold text-lg mb-4">Program Settings</h2>
    <form v-if="program" @submit.prevent="$emit('save', program)" class="space-y-4">
      <div>
        <label class="block font-medium">Program Name</label>
        <input type="text" v-model="program.name" class="w-full border rounded p-2" />
      </div>
      <div>
        <label class="block font-medium">Points per Currency Unit</label>
        <input type="number" v-model="program.pointsPerCurrency" class="w-full border rounded p-2" />
      </div>
      <div>
        <label class="block font-medium">Currency Unit per Point</label>
        <input type="number" v-model="program.currencyPerPoint" class="w-full border rounded p-2" />
      </div>
       <div class="flex items-center justify-between">
        <label class="font-medium">Is Active</label>
        <input type="checkbox" v-model="program.isActive" class="h-6 w-6" />
      </div>
      <div class="flex justify-end mt-4">
        <button type="submit" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Save Settings</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { LoyaltyProgram } from '~/shared/types/loyalty';

defineProps<{ program: LoyaltyProgram | null }>();
defineEmits(['save']);
</script>
