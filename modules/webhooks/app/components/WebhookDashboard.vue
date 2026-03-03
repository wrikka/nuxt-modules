<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useWebhookStats } from '#webhooks/composables';

const {
  statistics,
  isLoading,
  fetchStatistics,
  providerChartData,
  statusChartData,
} = useWebhookStats();

const dateRange = ref<{ start: Date | null; end: Date | null }>({
  start: null,
  end: null,
});

const providerColors: Record<string, string> = {
  stripe: '#635bff',
  github: '#333',
  slack: '#4a154b',
  custom: '#64748b',
};

onMounted(() => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  dateRange.value = { start: startDate, end: endDate };
  fetchStatistics(startDate, endDate);
});

const successRateDisplay = computed(() => {
  const rate = statistics.value.successRate;
  return rate.toFixed(1);
});

const statusColor = computed(() => {
  const rate = statistics.value.successRate;
  if (rate >= 95) return 'text-green-500';
  if (rate >= 80) return 'text-yellow-500';
  return 'text-red-500';
});
</script>

<template>
  <div class="webhook-dashboard p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Webhook Dashboard</h1>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        @click="fetchStatistics(dateRange.start ?? undefined, dateRange.end ?? undefined)"
      >
        Refresh
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
      <p class="mt-2 text-gray-500">Loading statistics...</p>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <p class="text-sm text-gray-500 dark:text-gray-400">Total Events</p>
          <p class="text-3xl font-bold">{{ statistics.total }}</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <p class="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
          <p class="text-3xl font-bold" :class="statusColor">{{ successRateDisplay }}%</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <p class="text-sm text-gray-500 dark:text-gray-400">Processed</p>
          <p class="text-3xl font-bold text-green-500">{{ statistics.byStatus.processed }}</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <p class="text-sm text-gray-500 dark:text-gray-400">Failed</p>
          <p class="text-3xl font-bold text-red-500">{{ statistics.byStatus.failed }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h2 class="text-lg font-semibold mb-4">Events by Provider</h2>
          <div class="space-y-3">
            <div
              v-for="{ name, value } in providerChartData"
              :key="name"
              class="flex items-center gap-3"
            >
              <div
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: providerColors[name] || '#64748b' }"
              />
              <span class="flex-1 capitalize">{{ name }}</span>
              <span class="font-semibold">{{ value }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h2 class="text-lg font-semibold mb-4">Status Distribution</h2>
          <div class="space-y-3">
            <div
              v-for="{ name, value, color } in statusChartData"
              :key="name"
              class="flex items-center gap-3"
            >
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: color }" />
              <span class="flex-1">{{ name }}</span>
              <span class="font-semibold">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
