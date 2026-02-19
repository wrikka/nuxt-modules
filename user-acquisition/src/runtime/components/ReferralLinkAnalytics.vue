<script setup lang="ts">
import { ref, computed } from 'vue';

interface LinkAnalytics {
  id: string;
  code: string;
  clicks: number;
  uniqueClicks: number;
  conversions: number;
  revenue: number;
  createdAt: Date;
}

const links = ref<LinkAnalytics[]>([
  {
    id: '1',
    code: 'SUMMER2024',
    clicks: 1250,
    uniqueClicks: 980,
    conversions: 75,
    revenue: 7500,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    code: 'WINTER2024',
    clicks: 890,
    uniqueClicks: 720,
    conversions: 52,
    revenue: 5200,
    createdAt: new Date('2023-12-01'),
  },
  {
    id: '3',
    code: 'HOLIDAY2023',
    clicks: 2100,
    uniqueClicks: 1650,
    conversions: 120,
    revenue: 12000,
    createdAt: new Date('2023-11-01'),
  },
]);

const selectedLink = ref<LinkAnalytics | null>(null);

const totalClicks = computed(() => links.value.reduce((sum, l) => sum + l.clicks, 0));
const totalConversions = computed(() => links.value.reduce((sum, l) => sum + l.conversions, 0));
const totalRevenue = computed(() => links.value.reduce((sum, l) => sum + l.revenue, 0));
const conversionRate = computed(() => totalClicks.value > 0 ? (totalConversions.value / totalClicks.value * 100).toFixed(2) : 0);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Referral Link Analytics</h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Total Clicks</div>
        <div class="text-2xl font-bold text-blue-600">{{ totalClicks }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Conversions</div>
        <div class="text-2xl font-bold text-green-600">{{ totalConversions }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Revenue</div>
        <div class="text-2xl font-bold text-purple-600">${{ totalRevenue.toLocaleString() }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Conversion Rate</div>
        <div class="text-2xl font-bold text-orange-600">{{ conversionRate }}%</div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Link Performance</h2>
      <div class="space-y-3">
        <div
          v-for="link in links"
          :key="link.id"
          class="p-4 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-colors"
          @click="selectedLink = link"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-semibold">{{ link.code }}</h3>
              <div class="text-sm text-gray-500">{{ new Date(link.createdAt).toLocaleDateString() }}</div>
            </div>
            <div class="text-right">
              <div class="font-bold text-blue-600">${{ link.revenue.toLocaleString() }}</div>
              <div class="text-xs text-gray-500">{{ link.conversions }} conversions</div>
            </div>
          </div>
          <div class="flex gap-4 text-sm">
            <span>{{ link.clicks }} clicks</span>
            <span>{{ link.uniqueClicks }} unique</span>
            <span>{{ ((link.conversions / link.clicks) * 100).toFixed(1) }}% rate</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
