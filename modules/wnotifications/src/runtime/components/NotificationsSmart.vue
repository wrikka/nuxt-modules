<script setup lang="ts">
import { computed } from 'vue';
import { useSmartNotifications } from '../composables/useSmartNotifications';

const {
  notificationActivities,
  enabled,
  getOptimalSendTime,
  getEngagementRate,
  getBestDays,
  getBestHours,
} = useSmartNotifications();

const optimalTime = computed(() => getOptimalSendTime());
const engagementRate = computed(() => getEngagementRate());
const bestDays = computed(() => getBestDays());
const bestHours = computed(() => getBestHours());

const hasData = computed(() => notificationActivities.value.length > 0);
</script>

<template>
  <div class="space-y-6 p-6">
    <h2 class="text-2xl font-bold">Smart Notifications</h2>

    <!-- Toggle -->
    <div class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div>
        <div class="font-semibold">Smart Scheduling</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ enabled ? 'Enabled' : 'Disabled' }}
        </div>
      </div>
      <button
        class="relative h-12 w-24 rounded-full transition-colors"
        :class="enabled ? 'bg-blue-500' : 'bg-gray-300'"
        @click="enabled = !enabled"
      >
        <div
          class="absolute top-1 h-10 w-10 rounded-full bg-white shadow transition-transform"
          :class="enabled ? 'translate-x-14' : 'translate-x-0'"
        />
      </button>
    </div>

    <!-- No Data State -->
    <div
      v-if="!hasData"
      class="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="i-heroicons-chart-bar mb-4 h-16 w-16 text-gray-400" />
      <h3 class="mb-2 text-lg font-semibold">No Activity Data Yet</h3>
      <p class="text-gray-600 dark:text-gray-400">
        Start using notifications and we'll learn your preferences to suggest optimal send times.
      </p>
    </div>

    <!-- Recommendations -->
    <div v-else class="space-y-6">
      <!-- Optimal Send Time -->
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h3 class="mb-3 font-semibold">Recommended Send Time</h3>
        <div class="flex items-center gap-4">
          <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ optimalTime.hour }}:{{ optimalTime.minute.toString().padStart(2, '0') }}
            </div>
          </div>
          <div class="flex-1">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ optimalTime.reason }}
            </div>
            <div class="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              Confidence: {{ optimalTime.score }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Engagement Rate -->
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h3 class="mb-3 font-semibold">Engagement Rate</h3>
        <div class="flex items-center gap-4">
          <div class="rounded-lg bg-green-50 p-4 dark:bg-green-900/30">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ engagementRate.toFixed(1) }}%
            </div>
          </div>
          <div class="flex-1">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Average notifications opened per unique notification in the last 7 days
            </div>
          </div>
        </div>
      </div>

      <!-- Best Days -->
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h3 class="mb-3 font-semibold">Most Active Days</h3>
        <div class="space-y-2">
          <div
            v-for="{ day, name, count } in bestDays"
            :key="day"
            class="flex items-center gap-3"
          >
            <div class="w-24 text-sm font-medium">{{ name }}</div>
            <div class="flex-1">
              <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-blue-500 dark:bg-blue-400"
                  :style="{ width: `${(count / bestDays[0].count) * 100}%` }"
                />
              </div>
            </div>
            <div class="w-12 text-right text-sm">{{ count }}</div>
          </div>
        </div>
      </div>

      <!-- Best Hours -->
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h3 class="mb-3 font-semibold">Most Active Hours</h3>
        <div class="space-y-2">
          <div
            v-for="{ hour, count } in bestHours"
            :key="hour"
            class="flex items-center gap-3"
          >
            <div class="w-24 text-sm font-medium">{{ hour }}:00</div>
            <div class="flex-1">
              <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-green-500 dark:bg-green-400"
                  :style="{ width: `${(count / bestHours[0].count) * 100}%` }"
                />
              </div>
            </div>
            <div class="w-12 text-right text-sm">{{ count }}</div>
          </div>
        </div>
      </div>

      <!-- Total Activities -->
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-semibold">Total Activities Recorded</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Based on {{ notificationActivities.length }} notification interactions
            </div>
          </div>
          <div class="text-2xl font-bold">{{ notificationActivities.length }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
