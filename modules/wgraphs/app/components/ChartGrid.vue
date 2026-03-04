<script setup lang="ts">
import type { AlgorithmInfo } from '../utils/index'

interface Props {
  algorithms: AlgorithmInfo[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  run: [algorithm: string]
}>()

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'pathfinding': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'traversal': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'mst': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'analysis': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'utility': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
  return colors[category] || colors.utility
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
    <div
      v-for="algorithm in algorithms"
      :key="algorithm.name"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div class="p-4">
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ algorithm.name }}
          </h3>
          <span
            class="px-2 py-1 text-xs font-medium rounded-full"
            :class="getCategoryColor(algorithm.category)"
          >
            {{ algorithm.category }}
          </span>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {{ algorithm.description }}
        </p>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span class="i-carbon-time" />
            <span>O({{ algorithm.timeComplexity }})</span>
          </div>

          <button
            class="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md transition-colors"
            @click="emit('run', algorithm.name)"
          >
            Run
          </button>
        </div>
      </div>

      <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="tag in algorithm.tags"
            :key="tag"
            class="px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
