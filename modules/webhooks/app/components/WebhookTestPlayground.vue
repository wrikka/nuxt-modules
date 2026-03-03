<script setup lang="ts">
import { ref } from 'vue';
import type { WebhookProvider } from '#webhooks/types';

const provider = ref<WebhookProvider>('stripe');
const eventType = ref('');
const payload = ref('{\n  \n}');
const signature = ref('');
const isLoading = ref(false);
const result = ref<{ success: boolean; message: string } | null>(null);

const samplePayloads: Record<WebhookProvider, string> = {
  stripe: JSON.stringify({ id: 'evt_test', object: 'event', type: 'payment_intent.succeeded', data: { object: {} } }, null, 2),
  github: JSON.stringify({ ref: 'refs/heads/main', repository: { name: 'test' }, sender: { login: 'user' } }, null, 2),
  slack: JSON.stringify({ type: 'event_callback', event: { type: 'message', text: 'Hello' } }, null, 2),
  custom: JSON.stringify({ event: 'custom', data: {} }, null, 2),
};

const loadSample = () => {
  payload.value = samplePayloads[provider.value];
};

const sendTest = async () => {
  isLoading.value = true;
  result.value = null;
  try {
    await $fetch(`/api/webhooks/${provider.value}/test`, {
      method: 'POST',
      body: { payload: payload.value, eventType: eventType.value, signature: signature.value || undefined },
    });
    result.value = { success: true, message: 'Webhook sent successfully' };
  } catch (e) {
    result.value = { success: false, message: e instanceof Error ? e.message : 'Failed to send webhook' };
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="webhook-test-playground p-6 space-y-4">
    <h2 class="text-xl font-bold">Webhook Test Playground</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">Provider</label>
        <select v-model="provider" class="w-full px-3 py-2 border rounded dark:bg-gray-800" @change="loadSample">
          <option value="stripe">Stripe</option>
          <option value="github">GitHub</option>
          <option value="slack">Slack</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Event Type (optional)</label>
        <input v-model="eventType" type="text" class="w-full px-3 py-2 border rounded dark:bg-gray-800" placeholder="e.g. payment_intent.succeeded" />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Payload</label>
      <textarea v-model="payload" rows="8" class="w-full px-3 py-2 border rounded font-mono text-sm dark:bg-gray-800" />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Signature (optional)</label>
      <input v-model="signature" type="text" class="w-full px-3 py-2 border rounded font-mono text-sm dark:bg-gray-800" placeholder="For testing signature verification" />
    </div>

    <div v-if="result" :class="['p-3 rounded', result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800']">
      {{ result.message }}
    </div>

    <button :disabled="isLoading" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" @click="sendTest">
      {{ isLoading ? 'Sending...' : 'Send Test Webhook' }}
    </button>
  </div>
</template>
