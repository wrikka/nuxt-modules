<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Affiliate {
  id: string;
  name: string;
  revenue: number;
  commission: number;
  conversions: number;
  rank: number;
}

const affiliates = ref<Affiliate[]>([]);
const loading = ref(true);

onMounted(async () => {
  affiliates.value = [
    { id: '1', name: 'John Doe', revenue: 15000, commission: 1500, conversions: 150, rank: 1 },
    { id: '2', name: 'Jane Smith', revenue: 12000, commission: 1200, conversions: 120, rank: 2 },
    { id: '3', name: 'Bob Johnson', revenue: 10000, commission: 1000, conversions: 100, rank: 3 },
    { id: '4', name: 'Alice Brown', revenue: 8000, commission: 800, conversions: 80, rank: 4 },
    { id: '5', name: 'Charlie Wilson', revenue: 6000, commission: 600, conversions: 60, rank: 5 },
  ];
  loading.value = false;
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Affiliate Leaderboard</h1>

    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-500">Loading...</div>
    </div>

    <div v-else class="bg-white rounded-lg shadow">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="affiliate in affiliates"
            :key="affiliate.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center justify-center w-8 h-8 rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-800': affiliate.rank === 1,
                  'bg-gray-100 text-gray-800': affiliate.rank === 2,
                  'bg-orange-100 text-orange-800': affiliate.rank === 3,
                  'bg-gray-50 text-gray-600': affiliate.rank > 3,
                }"
              >
                {{ affiliate.rank }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ affiliate.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">${{ affiliate.revenue.toLocaleString() }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-green-600">${{ affiliate.commission.toLocaleString() }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ affiliate.conversions }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
