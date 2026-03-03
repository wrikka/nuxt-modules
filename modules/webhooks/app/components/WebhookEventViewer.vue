<script setup lang="ts">
import { computed } from 'vue';
import type { WebhookEventSelect } from '#webhooks/repository';

const props = defineProps<{
  event: WebhookEventSelect;
}>();

const emit = defineEmits<{
  close: [];
  retry: [id: string];
}>();

const formattedData = computed(() => {
  return JSON.stringify(props.event.data, null, 2);
});

const formattedRaw = computed(() => {
  try {
    return JSON.stringify(JSON.parse(props.event.raw), null, 2);
  } catch {
    return props.event.raw;
  }
});
</script>

<template>
  <div class="webhook-event-viewer fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h3 class="text-lg font-semibold">Event Details</h3>
        <button class="text-gray-500 hover:text-gray-700" @click="emit('close')">×</button>
      </div>

      <div class="p-4 overflow-auto space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">ID</p>
            <p class="font-mono text-sm">{{ event.id }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Provider</p>
            <p class="capitalize">{{ event.provider }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Type</p>
            <p>{{ event.type }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Timestamp</p>
            <p>{{ new Date(event.timestamp).toLocaleString() }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Status</p>
            <p>{{ event.processed ? 'Processed' : 'Pending' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Retry Count</p>
            <p>{{ event.retryCount }}</p>
          </div>
        </div>

        <div v-if="event.error" class="bg-red-50 dark:bg-red-900/20 p-3 rounded">
          <p class="text-sm text-red-800 dark:text-red-200">{{ event.error }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500 mb-2">Parsed Data</p>
          <pre class="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-auto max-h-48">{{ formattedData }}</pre>
        </div>

        <div>
          <p class="text-sm text-gray-500 mb-2">Raw Payload</p>
          <pre class="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-auto max-h-48">{{ formattedRaw }}</pre>
        </div>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t dark:border-gray-700">
        <button v-if="event.error" class="px-4 py-2 bg-yellow-500 text-white rounded" @click="emit('retry', event.id)">Retry</button>
        <button class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded" @click="emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>
