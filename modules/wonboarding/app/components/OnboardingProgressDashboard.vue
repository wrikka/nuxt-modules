<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  steps?: Array<{
    id: string;
    title: string;
    completed: boolean;
    skipped: boolean;
    points?: number;
  }>;
  progress?: {
    percentage: number;
    startedAt?: Date;
    completedAt?: Date;
  };
  gamification?: {
    totalPoints: number;
    earnedPoints: number;
    level: number;
    badges: Array<{
      id: string;
      name: string;
      earnedAt?: Date;
    }>;
  };
  timeTracking?: {
    totalTimeSpent: number;
    averageStepTime: number;
  };
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => [],
  progress: () => ({ percentage: 0 }),
  gamification: () => ({ totalPoints: 0, earnedPoints: 0, level: 1, badges: [] }),
  timeTracking: () => ({ totalTimeSpent: 0, averageStepTime: 0 }),
});

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

const completedStepsCount = computed(() => {
  return props.steps.filter(s => s.completed).length;
});

const skippedStepsCount = computed(() => {
  return props.steps.filter(s => s.skipped).length;
});

const remainingStepsCount = computed(() => {
  return props.steps.filter(s => !s.completed && !s.skipped).length;
});

const progressColor = computed(() => {
  const p = props.progress.percentage;
  if (p >= 75) return 'from-green-400 to-green-600';
  if (p >= 50) return 'from-blue-400 to-blue-600';
  if (p >= 25) return 'from-yellow-400 to-yellow-600';
  return 'from-orange-400 to-orange-600';
});
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Onboarding Progress
        </h2>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span class="text-sm text-gray-500 dark:text-gray-400">Live</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ completedStepsCount }}
          </p>
        </div>

        <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Skipped</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ skippedStepsCount }}
          </p>
        </div>

        <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Remaining</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ remainingStepsCount }}
          </p>
        </div>

        <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ progress.percentage }}%
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600 dark:text-gray-400">Overall Progress</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ progress.percentage }}%</span>
          </div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-500 rounded-full bg-gradient-to-r"
              :class="progressColor"
              :style="{ width: `${progress.percentage}%` }"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Time</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ formatTime(timeTracking.totalTimeSpent) }}
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Step Time</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ formatTime(timeTracking.averageStepTime) }}
            </p>
          </div>
        </div>

        <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Level</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ gamification.level }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Points</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ gamification.earnedPoints }} / {{ gamification.totalPoints }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="gamification.badges.length > 0">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Badges Earned
          </p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="badge in gamification.badges"
              :key="badge.id"
              class="px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-full"
            >
              {{ badge.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
