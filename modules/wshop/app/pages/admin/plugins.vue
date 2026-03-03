<script setup lang="ts">
import { ref, computed } from 'vue';

interface PluginInstallation {
  isInstalled: string;
}

interface Plugin {
  id: string;
  name: string;
  description: string | null;
  author: string;
  version: string;
  status: 'active' | 'inactive' | 'pending_approval' | 'rejected';
  installations: PluginInstallation[];
}

definePageMeta({ layout: 'admin' });

const plugins = ref<Plugin[]>([]);
const page = ref(1);
const limit = ref(20);

const { pending, error, refresh } = await useAsyncData('plugins', async () => {
  const data = await $fetch<Plugin[]>('/api/plugins', {
    params: { page: page.value, limit: limit.value },
  });
  plugins.value = data;
  return data;
}, { watch: [page, limit] });

const isInstalled = (plugin: Plugin) => {
  return plugin.installations && plugin.installations.some(inst => inst.isInstalled === 'true');
};

const installPlugin = async (pluginId: string) => {
  try {
    await $fetch('/api/plugins', {
      method: 'POST',
      body: { pluginId },
    });
    await refresh(); // Refresh the list to show the new status
  } catch (err) {
    console.error('Failed to install plugin:', err);
    alert('Installation failed.');
  }
};

const uninstallPlugin = async (pluginId: string) => {
  if (!confirm('Are you sure you want to uninstall this plugin?')) return;
  try {
    await $fetch('/api/plugins', {
      method: 'DELETE',
      body: { pluginId },
    });
    await refresh(); // Refresh the list
  } catch (err) {
    console.error('Failed to uninstall plugin:', err);
    alert('Uninstallation failed.');
  }
};

const getStatusClass = (status: Plugin['status']) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'pending_approval': 'bg-yellow-100 text-yellow-800',
    'rejected': 'bg-red-100 text-red-800',
  };
  return classes[status] || 'bg-gray-100';
};

</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Plugin Marketplace</h1>

    <div v-if="pending && !plugins.length">Loading plugins...</div>
    <div v-else-if="error">Error loading plugins: {{ error.message }}</div>
    
    <div v-else class="bg-white rounded-lg shadow-md overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plugin</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="plugins.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-500">No plugins found.</td>
          </tr>
          <tr v-for="plugin in plugins" :key="plugin.id">
            <td class="px-6 py-4">
              <div class="font-medium text-gray-900">{{ plugin.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ plugin.version }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ plugin.author }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(plugin.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize">
                {{ plugin.status.replace('_', ' ') }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button v-if="isInstalled(plugin)" @click="uninstallPlugin(plugin.id)" class="text-red-600 hover:text-red-900">Uninstall</button>
              <button v-else @click="installPlugin(plugin.id)" class="text-indigo-600 hover:text-indigo-900">Install</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
