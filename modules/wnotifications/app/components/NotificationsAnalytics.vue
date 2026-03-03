<script setup lang="ts">
import { computed } from 'vue';
import { useNotificationAnalytics } from '../composables/useNotificationAnalytics';

const { analytics, getTrend, getTopTypes, getTopPriorities, getDailyData } = useNotificationAnalytics();

const trend = computed(() => getTrend(7));
const topTypes = computed(() => getTopTypes(5));
const topPriorities = computed(() => getTopPriorities(5));
const dailyData = computed(() => getDailyData(7));

const trendColor = computed(() => {
  if (trend.value > 0) return 'text-green-500';
  if (trend.value < 0) return 'text-red-500';
  return 'text-gray-500';
});

const trendIcon = computed(() => {
  if (trend.value > 0) return 'i-heroicons-arrow-trending-up';
  if (trend.value < 0) return 'i-heroicons-arrow-trending-down';
  return 'i-heroicons-minus';
});

const typeColors: Record<string, string> = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  system: 'bg-gray-500',
  message: 'bg-purple-500',
};
</script>

<template>
  <div class="space-y-6 p-6">
    <h2 class="text-2xl font-bold">Notification Analytics</h2>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="mb-2 text-sm text-gray-600 dark:text-gray-400">Total Notifications</div>
        <div class="text-3xl font-bold">{{ analytics.total }}</div>
        <div class="mt-2 flex items-center gap-1 text-sm">
          <div :class="trendIcon" class="h-4 w-4" />
          <span :class="trendColor">{{ trend.toFixed(1) }}%</span>
          <span class="text-gray-500">vs last week</span>
        </div>
      </div>

      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="mb-2 text-sm text-gray-600 dark:text-gray-400">Unread</div>
        <div class="text-3xl font-bold text-blue-500">{{ analytics.unread }}</div>
        <div class="mt-2 text-sm text-gray-500">
          {{ analytics.readRate.toFixed(1) }}% read rate
        </div>
      </div>

      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="mb-2 text-sm text-gray-600 dark:text-gray-400">Avg per Day</div>
        <div class="text-3xl font-bold">{{ analytics.avgPerDay.toFixed(1) }}</div>
        <div class="mt-2 text-sm text-gray-500">notifications/day</div>
      </div>

      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="mb-2 text-sm text-gray-600 dark:text-gray-400">Read</div>
        <div class="text-3xl font-bold text-green-500">{{ analytics.read }}</div>
        <div class="mt-2 text-sm text-gray-500">
          {{ analytics.readRate.toFixed(1) }}% of total
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <!-- Daily Trend -->
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h3 class="mb-4 text-lg font-semibold">Daily Notifications (Last 7 Days)</h3>
        <div class="flex h-48 items-end gap-2">
          <div
            v-for="data in dailyData"
            :key="data.date"
            class="flex flex-1 flex-col items-center"
          >
            <div
              class="w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600"
              :style="{ height: `${Math.max((data.count / Math.max(...dailyData.map(d => d.count), 1)) * 100, 5)}%` }"
            />
            <div class="mt-2 text-xs text-gray-500">
              {{ new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' }) }}
            </div>
            <div class="text-xs font-medium">{{ data.count }}</div>
          </div>
        </div>
      </div>

      <!-- Type Distribution -->
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h3 class="mb-4 text-lg font-semibold">By Type</h3>
        <div class="space-y-3">
          <div
            v-for="{ type, count } in topTypes"
            :key="type"
            class="flex items-center gap-3"
          >
            <div
              class="h-3 w-3 rounded-full"
              :class="typeColors[type]"
            />
            <div class="flex-1">
              <div class="mb-1 flex justify-between text-sm">
                <span class="font-medium capitalize">{{ type }}</span>
                <span>{{ count }}</span>
              </div>
              <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  class="h-full rounded-full transition-all"
                  :class="typeColors[type]"
                  :style="{ width: `${(count / analytics.total) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Priority Distribution -->
    <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h3 class="mb-4 text-lg font-semibold">By Priority</h3>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div
          v-for="{ priority, count } in topPriorities"
          :key="priority"
          class="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
        >
          <div class="mb-2 text-sm text-gray-600 dark:text-gray-400 capitalize">{{ priority }}</div>
          <div class="text-2xl font-bold">{{ count }}</div>
          <div class="mt-2 text-sm text-gray-500">
            {{ ((count / analytics.total) * 100).toFixed(1) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
