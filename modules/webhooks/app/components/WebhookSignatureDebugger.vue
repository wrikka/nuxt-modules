<script setup lang="ts">
import { ref, computed } from 'vue';

const provider = ref<'stripe' | 'github' | 'slack' | 'custom'>('stripe');
const payload = ref('');
const signature = ref('');
const secret = ref('');
const result = ref<{ valid: boolean; details: string } | null>(null);
const isLoading = ref(false);

const samplePayloads = computed(() => ({
  stripe: JSON.stringify({ id: 'evt_test', object: 'event', type: 'test' }, null, 2),
  github: JSON.stringify({ ref: 'refs/heads/main', repository: { name: 'test' } }, null, 2),
  slack: JSON.stringify({ type: 'event_callback', token: 'test' }, null, 2),
  custom: JSON.stringify({ event: 'custom' }, null, 2),
}));

const loadSample = () => {
  payload.value = samplePayloads.value[provider.value];
};

const verify = async () => {
  isLoading.value = true;
  result.value = null;

  try {
    const response = await $fetch<{ valid: boolean; details: string }>('/api/webhooks/debug/verify', {
      method: 'POST',
      body: {
        provider: provider.value,
        payload: payload.value,
        signature: signature.value,
        secret: secret.value,
      },
    });
    result.value = response;
  } catch (e) {
    result.value = { valid: false, details: e instanceof Error ? e.message : 'Verification failed' };
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="webhook-signature-debugger p-6 space-y-4">
    <h2 class="text-xl font-bold">Signature Debugger</h2>

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
        <label class="block text-sm font-medium mb-1">Secret</label>
        <input v-model="secret" type="password" class="w-full px-3 py-2 border rounded dark:bg-gray-800" placeholder="Webhook secret" />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Payload</label>
      <textarea v-model="payload" rows="6" class="w-full px-3 py-2 border rounded font-mono text-sm dark:bg-gray-800" />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Signature Header</label>
      <input v-model="signature" type="text" class="w-full px-3 py-2 border rounded font-mono text-sm dark:bg-gray-800" placeholder="X-Signature or Stripe-Signature value" />
    </div>

    <div v-if="result" :class="['p-4 rounded', result.valid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800']">
      <p class="font-semibold">{{ result.valid ? '✓ Valid' : '✗ Invalid' }}</p>
      <p class="text-sm mt-1">{{ result.details }}</p>
    </div>

    <button :disabled="isLoading || !payload || !signature" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" @click="verify">
      {{ isLoading ? 'Verifying...' : 'Verify Signature' }}
    </button>
  </div>
</template>
