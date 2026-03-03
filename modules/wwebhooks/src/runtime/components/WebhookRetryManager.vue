<script setup lang="ts">
import { onMounted } from 'vue';
import { useWebhookRetry } from '#webhooks/composables';

const { retryQueue, pendingRetries, failedRetries, isLoading, fetchRetryQueue, retryEvent, retryAllFailed, cancelRetry } = useWebhookRetry();

onMounted(fetchRetryQueue);
</script>

<template>
  <div class="webhook-retry-manager p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">Retry Queue</h2>
      <button v-if="failedRetries.length > 0" class="px-4 py-2 bg-yellow-500 text-white rounded" @click="retryAllFailed">Retry All Failed</button>
    </div>

    <div v-if="isLoading" class="text-center py-4">
      <div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
    </div>

    <div v-else-if="retryQueue.length === 0" class="text-center py-8 text-gray-500">No items in retry queue</div>

    <template v-else>
      <div class="space-y-2">
        <h3 class="font-semibold text-yellow-600">Pending ({{ pendingRetries.length }})</h3>
        <div v-for="item in pendingRetries" :key="item.id" class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded flex justify-between items-center">
          <div>
            <p class="font-mono text-sm">{{ item.eventId }}</p>
            <p class="text-xs text-gray-500">Scheduled: {{ new Date(item.scheduledAt).toLocaleString() }}</p>
          </div>
          <button class="text-red-500 text-sm" @click="cancelRetry(item.id)">Cancel</button>
        </div>
      </div>

      <div class="space-y-2">
        <h3 class="font-semibold text-red-600">Failed ({{ failedRetries.length }})</h3>
        <div v-for="item in failedRetries" :key="item.id" class="bg-red-50 dark:bg-red-900/20 p-3 rounded flex justify-between items-center">
          <div>
            <p class="font-mono text-sm">{{ item.eventId }}</p>
            <p class="text-xs text-red-600">{{ item.status }}</p>
          </div>
          <button class="text-yellow-600 text-sm" @click="retryEvent(item.eventId)">Retry</button>
        </div>
      </div>
    </template>
  </div>
</template>
