<script setup lang="ts">
import { computed } from "vue";
import { useDiffStatus } from "../composables/useDiffStatus";
import type { DiffResult } from "../types/diff";

interface Props {
	diff: DiffResult;
	title?: string;
}

const props = withDefaults(defineProps<Props>(), {
	title: "Diff Summary",
});

const { addedCount, deletedCount, updatedCount, totalChanges } = useDiffStatus(
	props.diff,
);

const totalItems = computed(
	() => addedCount.value + deletedCount.value + updatedCount.value,
);

const addedPercentage = computed(() =>
	totalChanges.value > 0 ? (addedCount.value / totalChanges.value) * 100 : 0,
);
const deletedPercentage = computed(() =>
	totalChanges.value > 0 ? (deletedCount.value / totalChanges.value) * 100 : 0,
);
const updatedPercentage = computed(() =>
	totalChanges.value > 0 ? (updatedCount.value / totalChanges.value) * 100 : 0,
);
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    <div v-if="title" class="px-4 py-3 bg-gray-50 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 m-0">{{ title }}</h3>
    </div>

    <div class="p-4 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">{{ totalChanges }}</div>
          <div class="text-sm text-gray-600">Total Changes</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">{{ totalItems }}</div>
          <div class="text-sm text-gray-600">Total Items</div>
        </div>
      </div>

      <div class="space-y-3">
        <!-- Added -->
        <div class="space-y-1">
          <div class="flex justify-between text-sm">
            <span class="text-green-700 font-medium">Added</span>
            <span class="text-green-700">{{ addedCount }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-green-500 h-2 rounded-full" :style="{ width: addedPercentage + '%' }"></div>
          </div>
        </div>

        <!-- Deleted -->
        <div class="space-y-1">
          <div class="flex justify-between text-sm">
            <span class="text-red-700 font-medium">Deleted</span>
            <span class="text-red-700">{{ deletedCount }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-red-500 h-2 rounded-full" :style="{ width: deletedPercentage + '%' }"></div>
          </div>
        </div>

        <!-- Updated -->
        <div class="space-y-1">
          <div class="flex justify-between text-sm">
            <span class="text-blue-700 font-medium">Updated</span>
            <span class="text-blue-700">{{ updatedCount }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-blue-500 h-2 rounded-full" :style="{ width: updatedPercentage + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
