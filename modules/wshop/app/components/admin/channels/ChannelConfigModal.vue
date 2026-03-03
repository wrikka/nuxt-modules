<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h3 class="text-xl font-bold mb-4">Configure {{ channel?.name }}</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">API Key</label>
          <input
            type="password"
            v-model="localConfig.apiKey"
            class="w-full border rounded p-2"
            placeholder="Enter API key"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Webhook URL</label>
          <input
            type="text"
            v-model="localConfig.webhookUrl"
            class="w-full border rounded p-2"
            placeholder="https://your-store.com/webhook"
          />
        </div>
      </div>
      <div class="flex gap-2 mt-6">
        <button
          @click="$emit('save', localConfig)"
          class="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Save
        </button>
        <button
          @click="$emit('close')"
          class="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Channel, ChannelConfig } from '~/shared/types/channel';

const props = defineProps<{ 
  show: boolean;
  channel: Channel | null;
}>();

defineEmits(['close', 'save']);

const localConfig = ref<ChannelConfig>({});

watch(() => props.channel, (newChannel) => {
  localConfig.value = { ...newChannel?.config };
});
</script>
