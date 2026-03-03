<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Themes</h1>

    <div v-if="pending" class="text-center py-8">Loading...</div>

    <div v-else-if="error" class="text-red-500">Failed to load settings</div>

    <div v-else class="space-y-6">
      <!-- Active Theme -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Active Theme</h2>
        <div class="flex items-center gap-4">
          <select v-model="activeTheme" @change="updateTheme" class="border rounded p-2">
            <option value="default">Default Theme</option>
          </select>
          <span class="text-sm text-gray-500">Select a theme to activate</span>
        </div>
      </div>

      <!-- Available Themes -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Available Themes</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="theme in availableThemes"
            :key="theme.id"
            class="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition"
            :class="{ 'border-blue-500': activeTheme === theme.id }"
            @click="selectTheme(theme.id)"
          >
            <div class="h-32 bg-gray-200 rounded mb-2"></div>
            <h3 class="font-semibold">{{ theme.name }}</h3>
            <p class="text-sm text-gray-600">{{ theme.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';

interface SiteSettings {
  id: string;
  activeTheme: string | null;
  themeConfig: Record<string, any> | null;
}

const { data: settings, pending, error, refresh } = await useFetch<SiteSettings | { success: boolean }>('/api/settings');

const activeTheme = ref('default');

watchEffect(() => {
  if (settings.value && 'activeTheme' in settings.value && settings.value.activeTheme) {
    activeTheme.value = settings.value.activeTheme;
  }
});

const availableThemes = [
  { id: 'default', name: 'Default', description: 'Clean and modern design' },
];

const selectTheme = (themeId: string) => {
  activeTheme.value = themeId;
  updateTheme();
};

const updateTheme = async () => {
  try {
    await $fetch('/api/settings', {
      method: 'POST',
      body: { activeTheme: activeTheme.value },
    });
    await refresh();
  } catch (error) {
    console.error('Failed to update theme:', error);
  }
};
</script>
