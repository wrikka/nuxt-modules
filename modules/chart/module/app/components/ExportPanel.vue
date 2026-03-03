<script setup lang="ts">
import { useChartExport } from "../composables/useChartExport";
import type { ChartData } from "../types/chart";

interface Props {
	chartData: ChartData;
	filename?: string;
}

const props = withDefaults(defineProps<Props>(), {
	filename: "chart-data",
});

const { downloadJSON, downloadCSV } = useChartExport();
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg bg-gray-50">
    <h4 class="mb-2 text-lg font-medium">Export Chart Data</h4>
    <div class="flex gap-2 mt-2">
      <button @click="downloadJSON(chartData, `${filename}.json`)" class="px-4 py-2 border border-gray-300 rounded bg-white cursor-pointer flex items-center gap-2 hover:bg-gray-100">
        <Icon name="lucide:download" />
        Export JSON
      </button>
      <button @click="downloadCSV(chartData, `${filename}.csv`)" class="px-4 py-2 border border-gray-300 rounded bg-white cursor-pointer flex items-center gap-2 hover:bg-gray-100">
        <Icon name="lucide:download" />
        Export CSV
      </button>
    </div>
  </div>
</template>
