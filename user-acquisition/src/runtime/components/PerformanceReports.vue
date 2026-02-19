<script setup lang="ts">
import { ref } from 'vue';

interface Report {
  id: string;
  title: string;
  period: string;
  generatedAt: Date;
  status: 'ready' | 'generating';
}

const reports = ref<Report[]>([
  {
    id: '1',
    title: 'Monthly Performance Report - February 2024',
    period: 'February 2024',
    generatedAt: new Date('2024-02-01'),
    status: 'ready',
  },
  {
    id: '2',
    title: 'Monthly Performance Report - January 2024',
    period: 'January 2024',
    generatedAt: new Date('2024-01-01'),
    status: 'ready',
  },
  {
    id: '3',
    title: 'Monthly Performance Report - December 2023',
    period: 'December 2023',
    generatedAt: new Date('2023-12-01'),
    status: 'ready',
  },
]);

const showGenerateModal = ref(false);
const selectedPeriod = ref('monthly');
const periods = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

function generateReport() {
  reports.value.unshift({
    id: Date.now().toString(),
    title: `${periods.find((p) => p.value === selectedPeriod.value)?.label} Performance Report`,
    period: new Date().toLocaleDateString(),
    generatedAt: new Date(),
    status: 'ready',
  });
  showGenerateModal.value = false;
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Performance Reports</h1>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        @click="showGenerateModal = true"
      >
        Generate Report
      </button>
    </div>

    <div class="space-y-3">
      <div
        v-for="report in reports"
        :key="report.id"
        class="bg-white rounded-lg shadow p-4"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold">{{ report.title }}</h3>
            <div class="text-sm text-gray-500">{{ new Date(report.generatedAt).toLocaleString() }}</div>
          </div>
          <div class="flex gap-2">
            <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
              Download
            </button>
            <button class="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300">
              View
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showGenerateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Generate Performance Report</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Report Period</label>
            <select v-model="selectedPeriod" class="w-full border rounded px-3 py-2">
              <option v-for="period in periods" :key="period.value" :value="period.value">
                {{ period.label }}
              </option>
            </select>
          </div>
          <div class="flex gap-2">
            <button
              class="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              @click="generateReport"
            >
              Generate
            </button>
            <button
              class="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
              @click="showGenerateModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
