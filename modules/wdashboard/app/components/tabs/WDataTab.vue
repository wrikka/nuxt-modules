<script setup lang="ts">
const dataUsage = ref({
  total: 2.4,
  used: 1.2,
  unit: 'GB'
})

const exportHistory = ref([
  { id: 1, type: 'Full Export', format: 'JSON', date: '2024-01-15', status: 'completed' },
  { id: 2, type: 'Data Export', format: 'CSV', date: '2024-01-10', status: 'completed' },
  { id: 3, type: 'Media Export', format: 'ZIP', date: '2024-01-05', status: 'expired' }
])

const exportFormat = ref('json')
const isExporting = ref(false)

const handleExport = async () => {
  isExporting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    exportHistory.value.unshift({
      id: Date.now(),
      type: 'Manual Export',
      format: exportFormat.value.toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    })
  } finally {
    isExporting.value = false
  }
}

const handleRequestDeletion = () => {
  console.log('Request data deletion')
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Storage Usage</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-gray-500">Used</span>
          <span class="font-medium">{{ dataUsage.used }} {{ dataUsage.unit }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full" :style="{ width: (dataUsage.used / dataUsage.total * 100) + '%' }" />
        </div>
        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>{{ dataUsage.used }} GB used</span>
          <span>{{ dataUsage.total }} GB total</span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Export Your Data</h2>
      <div class="space-y-4">
        <p class="text-sm text-gray-500">Download a copy of your data in your preferred format</p>
        <div class="grid gap-4 md:grid-cols-3">
          <label class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 has-[:checked]:border-blue-600">
            <input v-model="exportFormat" type="radio" value="json" class="mt-1">
            <div>
              <p class="font-medium">JSON</p>
              <p class="text-sm text-gray-500">Machine readable</p>
            </div>
          </label>
          <label class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 has-[:checked]:border-blue-600">
            <input v-model="exportFormat" type="radio" value="csv" class="mt-1">
            <div>
              <p class="font-medium">CSV</p>
              <p class="text-sm text-gray-500">Spreadsheet format</p>
            </div>
          </label>
          <label class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 has-[:checked]:border-blue-600">
            <input v-model="exportFormat" type="radio" value="pdf" class="mt-1">
            <div>
              <p class="font-medium">PDF</p>
              <p class="text-sm text-gray-500">Human readable</p>
            </div>
          </label>
        </div>
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" :disabled="isExporting" @click="handleExport">
          {{ isExporting ? 'Exporting...' : 'Export Data' }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Export History</h2>
      <div class="space-y-2">
        <div v-for="item in exportHistory" :key="item.id" class="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p class="font-medium">{{ item.type }}</p>
            <p class="text-sm text-gray-500">{{ item.format }} · {{ item.date }}</p>
          </div>
          <span class="px-2 py-1 text-xs rounded-full" :class="item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">{{ item.status }}</span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6 border-red-200">
      <h2 class="text-xl font-semibold text-red-600 mb-4">Data Deletion</h2>
      <div class="space-y-4">
        <p class="text-sm text-gray-500">Request permanent deletion of all your data. This action cannot be undone.</p>
        <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" @click="handleRequestDeletion">Request Data Deletion</button>
      </div>
    </div>
  </div>
</template>
