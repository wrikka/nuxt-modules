<script setup lang="ts">
import { ref } from 'vue';

interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontFamily: string;
}

interface Props {
  theme?: ThemeConfig;
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => ({
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    borderRadius: '12px',
    fontFamily: 'Inter',
  }),
  show: true,
});

const emit = defineEmits<{
  save: [theme: ThemeConfig];
  reset: [];
  close: [];
}>();

const localTheme = ref<ThemeConfig>({ ...props.theme });

const colorPresets = [
  { name: 'Blue', primary: '#3B82F6', secondary: '#8B5CF6' },
  { name: 'Green', primary: '#10B981', secondary: '#06B6D4' },
  { name: 'Purple', primary: '#8B5CF6', secondary: '#EC4899' },
  { name: 'Orange', primary: '#F59E0B', secondary: '#EF4444' },
  { name: 'Pink', primary: '#EC4899', secondary: '#8B5CF6' },
];

const radiusPresets = [
  { name: 'None', value: '0px' },
  { name: 'Small', value: '8px' },
  { name: 'Medium', value: '12px' },
  { name: 'Large', value: '16px' },
  { name: 'X-Large', value: '24px' },
];

const fontPresets = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Poppins',
  'Nunito',
];

const applyPreset = (preset: typeof colorPresets[0]) => {
  localTheme.value.primaryColor = preset.primary;
  localTheme.value.secondaryColor = preset.secondary;
};

const handleSave = () => {
  emit('save', localTheme.value);
  emit('close');
};

const handleReset = () => {
  localTheme.value = { ...props.theme };
  emit('reset');
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    Theme Customization
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Customize the look and feel
                  </p>
                </div>
              </div>
              <button
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                @click="emit('close')"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Color Presets
                </label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="preset in colorPresets"
                    :key="preset.name"
                    class="px-4 py-2 rounded-lg border-2 transition-all hover:scale-105"
                    :style="{
                      borderColor: preset.primary,
                      backgroundColor: `${preset.primary}20`,
                    }"
                    @click="applyPreset(preset)"
                  >
                    <span class="text-sm font-medium" :style="{ color: preset.primary }">
                      {{ preset.name }}
                    </span>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Color
                  </label>
                  <div class="flex items-center gap-2">
                    <input
                      v-model="localTheme.primaryColor"
                      type="color"
                      class="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      v-model="localTheme.primaryColor"
                      type="text"
                      class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Secondary Color
                  </label>
                  <div class="flex items-center gap-2">
                    <input
                      v-model="localTheme.secondaryColor"
                      type="color"
                      class="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      v-model="localTheme.secondaryColor"
                      type="text"
                      class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Border Radius
                </label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="preset in radiusPresets"
                    :key="preset.value"
                    class="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all"
                    :class="{
                      'border-blue-500 bg-blue-50 dark:bg-blue-900/20': localTheme.borderRadius === preset.value,
                    }"
                    @click="localTheme.borderRadius = preset.value"
                  >
                    {{ preset.name }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Font Family
                </label>
                <select
                  v-model="localTheme.fontFamily"
                  class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white"
                >
                  <option v-for="font in fontPresets" :key="font" :value="font">
                    {{ font }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Preview
                </label>
                <div
                  class="p-6 rounded-xl border-2"
                  :style="{
                    backgroundColor: localTheme.backgroundColor,
                    color: localTheme.textColor,
                    borderRadius: localTheme.borderRadius,
                    fontFamily: localTheme.fontFamily,
                  }"
                >
                  <div class="space-y-3">
                    <div
                      class="px-4 py-2 rounded-lg text-white font-medium text-center"
                      :style="{ backgroundColor: localTheme.primaryColor }"
                    >
                      Primary Button
                    </div>
                    <div
                      class="px-4 py-2 rounded-lg text-white font-medium text-center"
                      :style="{ backgroundColor: localTheme.secondaryColor }"
                    >
                      Secondary Button
                    </div>
                    <p class="text-sm">
                      This is a preview of how your theme will look. The colors, fonts, and spacing will be applied to all onboarding components.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-3 mt-6">
              <button
                class="flex-1 py-3 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                @click="handleReset"
              >
                Reset
              </button>
              <button
                class="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                @click="handleSave"
              >
                Save Theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
