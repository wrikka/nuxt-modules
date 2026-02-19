<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <div class="flex items-center gap-4 mb-4">
      <div class="text-4xl">{{ channel.icon }}</div>
      <div>
        <h3 class="font-semibold text-lg">{{ channel.name }}</h3>
        <p class="text-sm text-gray-600">{{ channel.description }}</p>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          :checked="channel.enabled"
          @change="$emit('toggle', channel.id)"
          class="w-4 h-4"
        />
        <span class="text-sm text-gray-600">
          {{ channel.enabled ? "Connected" : "Not connected" }}
        </span>
      </div>
      <button
        v-if="channel.enabled"
        @click="$emit('configure', channel.id)"
        class="px-4 py-2 border rounded hover:bg-gray-50"
      >
        Configure
      </button>
      <button
        v-else
        @click="$emit('connect', channel.id)"
        class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Connect
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  channel: { type: null, required: true }
});
defineEmits(["toggle", "configure", "connect"]);
</script>
