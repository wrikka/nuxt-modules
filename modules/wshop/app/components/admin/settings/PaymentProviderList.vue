<template>
  <div class="space-y-4">
    <div v-for="provider in providers" :key="provider.id" class="p-4 border rounded-lg flex justify-between items-center">
      <div>
        <h3 class="font-bold">{{ provider.name }}</h3>
        <p class="text-sm text-gray-500">{{ provider.description }}</p>
      </div>
      <div>
        <button v-if="provider.connected" class="px-3 py-1 text-sm border rounded-md bg-gray-100">Manage</button>
        <button v-else class="px-3 py-1 text-sm border rounded-md bg-blue-500 text-white">Connect</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PaymentProvider {
  id: string;
  name: string;
  connected: boolean;
  description: string;
}

defineProps<{
  providers: PaymentProvider[];
}>();
</script>
