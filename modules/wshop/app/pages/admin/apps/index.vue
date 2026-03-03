<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">App Store</h1>

    <div v-if="pending" class="text-center py-8">Loading...</div>

    <div v-else-if="error" class="text-red-500">Failed to load apps</div>

    <div v-else>
      <!-- Categories -->
      <div class="mb-6 flex gap-2 flex-wrap">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          class="px-4 py-2 rounded-full border"
          :class="{ 'bg-black text-white': selectedCategory === category }"
        >
          {{ category }}
        </button>
      </div>

      <!-- Apps Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="app in filteredApps"
          :key="app.id"
          class="bg-white rounded-lg shadow overflow-hidden"
        >
          <div class="h-40 bg-gray-200 flex items-center justify-center">
            <div class="text-4xl">{{ app.icon || '📦' }}</div>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-1">{{ app.name }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ app.description }}</p>
            <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>{{ app.author }}</span>
              <span>{{ app.pricing.type === 'free' ? 'Free' : `$${app.pricing.price}/mo` }}</span>
            </div>
            <div class="flex gap-2">
              <button
                v-if="isInstalled(app.id)"
                @click="uninstallApp(app.id)"
                class="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
              >
                Uninstall
              </button>
              <button
                v-else
                @click="installApp(app.id)"
                class="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface App {
  id: string;
  icon: string | null;
  name: string;
  description: string | null;
  author: string | null;
  pricing: { type: string; price?: number };
  category: string;
}

interface InstalledApp {
  id: string;
  appId: string;
}
const { data: apps, pending, error, refresh } = await useFetch<App[]>('/api/apps');
const { data: installedApps, refresh: refreshInstalled } = await useFetch<InstalledApp[]>('/api/apps/installed');

const selectedCategory = ref('All');
const categories = ['All', 'Marketing', 'Sales', 'Analytics', 'Customer Service', 'Inventory'];

const filteredApps = computed(() => {
  if (selectedCategory.value === 'All') return apps.value || [];
  return apps.value?.filter(app => app.category === selectedCategory.value) || [];
});

const isInstalled = (appId: string) => {
  return installedApps.value?.some(ia => ia.appId === appId) || false;
};

const installApp = async (appId: string) => {
  try {
    await $fetch('/api/apps', {
      method: 'POST',
      body: { appId },
    });
    await refreshInstalled();
  } catch (error) {
    console.error('Failed to install app:', error);
  }
};

const uninstallApp = async (installedAppId: string) => {
  try {
    await $fetch(`/api/apps/${installedAppId}`, { method: 'DELETE' });
    await refreshInstalled();
  } catch (error) {
    console.error('Failed to uninstall app:', error);
  }
};
</script>
