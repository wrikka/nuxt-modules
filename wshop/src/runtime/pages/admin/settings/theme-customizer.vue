<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Theme Customization</h1>

    <div v-if="pending" class="text-center py-8">Loading...</div>

    <div v-else-if="error" class="text-red-500">Failed to load settings</div>

    <div v-else class="space-y-6">
      <!-- Colors -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Colors</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Primary Color</label>
            <input type="color" v-model="themeConfig.colors.primary" @change="updateTheme" class="w-full h-10 rounded cursor-pointer">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Secondary Color</label>
            <input type="color" v-model="themeConfig.colors.secondary" @change="updateTheme" class="w-full h-10 rounded cursor-pointer">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Accent Color</label>
            <input type="color" v-model="themeConfig.colors.accent" @change="updateTheme" class="w-full h-10 rounded cursor-pointer">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Background Color</label>
            <input type="color" v-model="themeConfig.colors.background" @change="updateTheme" class="w-full h-10 rounded cursor-pointer">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Text Color</label>
            <input type="color" v-model="themeConfig.colors.text" @change="updateTheme" class="w-full h-10 rounded cursor-pointer">
          </div>
        </div>
      </div>

      <!-- Fonts -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Fonts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Heading Font</label>
            <select v-model="themeConfig.fonts.heading" @change="updateTheme" class="w-full border rounded p-2">
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Body Font</label>
            <select v-model="themeConfig.fonts.body" @change="updateTheme" class="w-full border rounded p-2">
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Spacing -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Spacing</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Container Spacing</label>
            <select v-model="themeConfig.spacing.container" @change="updateTheme" class="w-full border rounded p-2">
              <option value="max-w-5xl mx-auto px-4">Small</option>
              <option value="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">Medium</option>
              <option value="max-w-full px-4">Full Width</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Section Spacing</label>
            <select v-model="themeConfig.spacing.section" @change="updateTheme" class="w-full border rounded p-2">
              <option value="py-8">Compact</option>
              <option value="py-12">Standard</option>
              <option value="py-16">Spacious</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Preview</h2>
        <div class="border rounded p-8" :style="previewStyles">
          <h1 class="text-2xl font-bold mb-2">Sample Heading</h1>
          <p class="mb-4">This is a sample paragraph with the theme settings applied.</p>
          <button class="px-4 py-2 rounded text-white" :style="{ backgroundColor: themeConfig.colors.primary }">Sample Button</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';

interface ThemeConfig {
  colors: { [key: string]: string };
  fonts: { [key: string]: string };
  spacing: { [key: string]: string };
}

interface SiteSettings {
  id: string;
  activeTheme: string | null;
  themeConfig: ThemeConfig | null;
}

const { data: settings, pending, error, refresh } = await useFetch<SiteSettings | { success: boolean }>('/api/settings');

const themeConfig = ref<ThemeConfig>({
  colors: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#3b82f6',
    background: '#ffffff',
    text: '#000000'
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter'
  },
  spacing: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-12'
  }
});

watchEffect(() => {
  if (settings.value && 'themeConfig' in settings.value && settings.value.themeConfig) {
    themeConfig.value = settings.value.themeConfig;
  }
});

const previewStyles = computed(() => ({
  backgroundColor: themeConfig.value.colors.background,
  color: themeConfig.value.colors.text,
  fontFamily: themeConfig.value.fonts.body
}));

const updateTheme = async () => {
  try {
    await $fetch('/api/settings', {
      method: 'POST',
      body: { themeConfig: themeConfig.value },
    });
    await refresh();
  } catch (error) {
    console.error('Failed to update theme:', error);
  }
};
</script>
