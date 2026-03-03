<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    <div v-if="title" class="px-4 py-3 bg-gray-50 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 m-0">{{ title }}</h3>
    </div>

    <div class="p-4 space-y-4">
      <!-- Added items -->
      <DiffSection v-if="Object.keys(diff.added).length > 0" type="added" :items="diff.added" icon="➕" label="Added" />

      <!-- Deleted items -->
      <DiffSection v-if="Object.keys(diff.deleted).length > 0" type="deleted" :items="diff.deleted" icon="➖" label="Deleted" />

      <!-- Updated items -->
      <DiffSection v-if="Object.keys(diff.updated).length > 0" type="updated" :items="diff.updated" icon="✏️" label="Updated" />

      <!-- No changes -->
      <div v-if="isEmpty" class="flex items-center justify-center py-8 text-gray-500">
        <span class="mr-2 text-lg">✅</span>
        <span class="text-sm font-medium">No changes detected</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiffResult } from "../types/diff";
import { useDiffStatus } from "../composables/useDiffStatus";

interface Props {
	diff: DiffResult;
	title?: string;
	maxItems?: number;
}

const props = withDefaults(defineProps<Props>(), {
	maxItems: 50,
});

const { isEmpty } = useDiffStatus(props.diff);
</script>
