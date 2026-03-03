<script setup lang="ts">
import { ref } from 'vue';

const bulkSize = ref(10);
const prefix = ref('CAMPAIGN');
const codes = ref<string[]>([]);
const showPreview = ref(false);

function generateCodes() {
  codes.value = Array.from({ length: bulkSize.value }, (_, i) => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix.value}_${random}`;
  });
  showPreview.value = true;
}

function downloadCodes() {
  const content = codes.value.join('\n');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'referral-codes.txt';
  a.click();
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Bulk Referral Code Generation</h1>

    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Generate Codes</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Number of Codes</label>
          <input v-model.number="bulkSize" type="number" min="1" max="1000" class="w-full border rounded px-3 py-2">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Prefix</label>
          <input v-model="prefix" type="text" class="w-full border rounded px-3 py-2" placeholder="CAMPAIGN">
        </div>
        <button
          class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          @click="generateCodes"
        >
          Generate Codes
        </button>
      </div>
    </div>

    <div v-if="showPreview && codes.length" class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Generated Codes ({{ codes.length }})</h2>
        <div class="flex gap-2">
          <button
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            @click="downloadCodes"
          >
            Download
          </button>
          <button
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            @click="showPreview = false"
          >
            Close
          </button>
        </div>
      </div>
      <div class="bg-gray-50 rounded p-4 max-h-64 overflow-y-auto">
        <code class="text-sm">{{ codes.join('\n') }}</code>
      </div>
    </div>

    <div class="p-4 bg-blue-50 rounded">
      <h3 class="font-semibold text-blue-800 mb-2">Usage Tips</h3>
      <ul class="text-sm text-blue-700 space-y-1">
        <li>• Use unique prefixes for different campaigns</li>
        <li>• Generate up to 1000 codes at once</li>
        <li>• Download as text file for easy distribution</li>
        <li>• Track code usage in analytics dashboard</li>
      </ul>
    </div>
  </div>
</template>
