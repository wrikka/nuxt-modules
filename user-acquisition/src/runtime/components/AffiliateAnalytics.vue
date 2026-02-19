<script setup lang="ts">
import { ref, computed } from 'vue';

const timeRange = ref('7d');
const timeRanges = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y', label: '1 Year' },
];

const stats = ref({
  totalRevenue: 15000,
  totalCommission: 1500,
  conversions: 150,
  clickThroughRate: 5.2,
  averageOrderValue: 100,
});

const trends = ref([
  { date: '2024-01-01', revenue: 1000, conversions: 10 },
  { date: '2024-01-02', revenue: 1200, conversions: 12 },
  { date: '2024-01-03', revenue: 1100, conversions: 11 },
  { date: '2024-01-04', revenue: 1300, conversions: 13 },
  { date: '2024-01-05', revenue: 1400, conversions: 14 },
  { date: '2024-01-06', revenue: 1500, conversions: 15 },
  { date: '2024-01-07', revenue: 1600, conversions: 16 },
]);

const totalTrendRevenue = computed(() => trends.value.reduce((sum, t) => sum + t.revenue, 0));
const totalTrendConversions = computed(() => trends.value.reduce((sum, t) => sum + t.conversions, 0));
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Affiliate Performance Analytics</h1>

    <div class="mb-6">
      <div class="flex gap-2">
        <button
          v-for="range in timeRanges"
          :key="range.value"
          class="px-4 py-2 rounded-lg"
          :class="timeRange === range.value ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'"
          @click="timeRange = range.value"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Total Revenue</div>
        <div class="text-2xl font-bold text-blue-600">${{ stats.totalRevenue.toLocaleString() }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Total Commission</div>
        <div class="text-2xl font-bold text-green-600">${{ stats.totalCommission.toLocaleString() }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Conversions</div>
        <div class="text-2xl font-bold text-purple-600">{{ stats.conversions }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">CTR</div>
        <div class="text-2xl font-bold text-orange-600">{{ stats.clickThroughRate }}%</div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Revenue Trend</h2>
      <div class="h-64 bg-gray-50 rounded flex items-center justify-center">
        <span class="text-gray-400">Chart Placeholder</span>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Performance Breakdown</h2>
      <div class="space-y-3">
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
          <span>Average Order Value</span>
          <span class="font-semibold">${{ stats.averageOrderValue }}</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
          <span>Conversion Rate</span>
          <span class="font-semibold">{{ (stats.conversions / stats.totalRevenue * 100).toFixed(2) }}%</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
          <span>Commission Rate</span>
          <span class="font-semibold">10%</span>
        </div>
      </div>
    </div>
  </div>
</template>
