<script setup lang="ts">
import { useChartImport } from "../composables/useChartImport";
import type { ChartData } from "../types/chart";

const emit = defineEmits<{
	imported: [data: ChartData];
}>();

const { importFromFile } = useChartImport();

const handleFileChange = async (event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file) {
		try {
			const data = await importFromFile(file);
			emit("imported", data);
		} catch (error) {
			console.error("Import error:", error);
			alert("Failed to import file. Please check the format.");
		}
	}
};
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg bg-gray-50">
    <h4 class="mb-2 text-lg font-medium">Import Chart Data</h4>
    <div class="mt-2">
      <label for="file-input" class="inline-block px-4 py-2 border border-gray-300 rounded bg-white cursor-pointer flex items-center gap-2 hover:bg-gray-100">
        <Icon name="lucide:upload" />
        Choose File
      </label>
      <input
        id="file-input"
        type="file"
        accept=".json,.csv"
        @change="handleFileChange"
        class="hidden"
      />
      <p class="text-sm text-gray-600 mt-2">Supported formats: JSON, CSV</p>
    </div>
  </div>
</template>
