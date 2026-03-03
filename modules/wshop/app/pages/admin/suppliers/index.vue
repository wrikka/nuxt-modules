<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Suppliers</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="supplier in availableSuppliers"
        :key="supplier.id"
        class="bg-white p-6 rounded-lg shadow"
      >
        <div class="flex items-center gap-4 mb-4">
          <div class="text-4xl">{{ supplier.icon }}</div>
          <div>
            <h3 class="font-semibold text-lg">{{ supplier.name }}</h3>
            <p class="text-sm text-gray-600">{{ supplier.description }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              :checked="isConnected(supplier.id)"
              @change="toggleSupplier(supplier.id)"
              class="w-4 h-4"
            >
            <span class="text-sm text-gray-600">
              {{ isConnected(supplier.id) ? 'Connected' : 'Not connected' }}
            </span>
          </div>
          <button
            v-if="isConnected(supplier.id)"
            @click="configureSupplier(supplier.id)"
            class="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Configure
          </button>
          <button
            v-else
            @click="connectSupplier(supplier.id)"
            class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Connect
          </button>
        </div>
      </div>
    </div>

    <!-- Supplier Configuration Modal -->
    <div v-if="showConfigModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Configure {{ selectedSupplier?.name }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">API Key</label>
            <input
              type="password"
              v-model="supplierConfig.apiKey"
              class="w-full border rounded p-2"
              placeholder="Enter API key"
            >
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Webhook URL</label>
            <input
              type="text"
              v-model="supplierConfig.webhookUrl"
              class="w-full border rounded p-2"
              placeholder="https://your-store.com/webhook"
            >
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button
            @click="saveConfig"
            class="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Save
          </button>
          <button
            @click="showConfigModal = false"
            class="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Supplier } from '#shared/types';

const { data: suppliers, refresh } = await useFetch<Supplier[]>('/api/suppliers', { default: () => [] });

const showConfigModal = ref(false);
const selectedSupplier = ref<any>(null);
const supplierConfig = ref({ apiKey: '', webhookUrl: '' });

const availableSuppliers = [
  { id: 'printful', name: 'Printful', icon: '🎨', description: 'Print-on-demand service' },
  { id: 'printify', name: 'Printify', icon: '🖨️', description: 'Print-on-demand service' },
  { id: 'spocket', name: 'Spocket', icon: '📦', description: 'Dropshipping service' },
  { id: 'modalyst', name: 'Modalyst', icon: '🛍️', description: 'Dropshipping service' },
];

const isConnected = (supplierId: string) => {
  return suppliers.value.some(s => s.id === supplierId && s.enabled);
};

const connectSupplier = async (supplierId: string) => {
  try {
    await $fetch('/api/suppliers', {
      method: 'POST',
      body: { id: supplierId, type: supplierId, enabled: true },
    });
    await refresh();
  } catch (error) {
    console.error('Failed to connect supplier:', error);
  }
};

const toggleSupplier = async (supplierId: string) => {
  try {
    await $fetch(`/api/suppliers/${supplierId}`, {
      method: 'PUT',
      body: { enabled: !isConnected(supplierId) },
    });
    await refresh();
  } catch (error) {
    console.error('Failed to toggle supplier:', error);
  }
};

const configureSupplier = (supplierId: string) => {
  selectedSupplier.value = availableSuppliers.find(s => s.id === supplierId);
  showConfigModal.value = true;
};

const saveConfig = async () => {
  try {
    await $fetch(`/api/suppliers/${selectedSupplier.value.id}`, {
      method: 'PUT',
      body: { config: supplierConfig.value },
    });
    showConfigModal.value = false;
  } catch (error) {
    console.error('Failed to save config:', error);
  }
};
</script>
