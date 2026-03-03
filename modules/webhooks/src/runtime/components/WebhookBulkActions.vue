<script setup lang="ts">
import { useWebhookBulk } from '#webhooks/composables';

const props = defineProps<{
  totalEvents: number;
}>();

const emit = defineEmits<{
  refresh: [];
}>();

const { selectionCount, hasSelection, isLoading, lastResult, bulkDelete, bulkRetry, bulkExport, clearSelection } = useWebhookBulk();

const handleDelete = async () => {
  if (confirm(`Delete ${selectionCount.value} events?`)) {
    await bulkDelete();
    emit('refresh');
  }
};

const handleRetry = async () => {
  await bulkRetry();
  emit('refresh');
};

const handleExport = async (format: 'json' | 'csv') => {
  const result = await bulkExport(format);
  if (result) {
    const blob = new Blob([result.data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);
  }
};
</script>

<template>
  <div class="webhook-bulk-actions flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
    <span v-if="hasSelection" class="text-sm">
      {{ selectionCount }} selected
    </span>

    <template v-if="hasSelection">
      <button :disabled="isLoading" class="px-3 py-1 text-sm bg-yellow-500 text-white rounded" @click="handleRetry">Retry</button>
      <button :disabled="isLoading" class="px-3 py-1 text-sm bg-red-500 text-white rounded" @click="handleDelete">Delete</button>
      <button :disabled="isLoading" class="px-3 py-1 text-sm bg-gray-500 text-white rounded" @click="handleExport('json')">Export JSON</button>
      <button :disabled="isLoading" class="px-3 py-1 text-sm bg-gray-500 text-white rounded" @click="handleExport('csv')">Export CSV</button>
      <button class="px-3 py-1 text-sm text-gray-600" @click="clearSelection">Clear</button>
    </template>

    <div v-if="lastResult" class="text-sm">
      <span class="text-green-600">{{ lastResult.success }} succeeded</span>
      <span v-if="lastResult.failed > 0" class="text-red-600 ml-2">{{ lastResult.failed }} failed</span>
    </div>
  </div>
</template>
