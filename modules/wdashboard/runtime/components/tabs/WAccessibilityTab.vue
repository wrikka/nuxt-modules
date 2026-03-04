<script setup lang="ts">
const settings = ref({
  highContrast: false,
  reduceMotion: false,
  largeText: false,
  screenReader: false,
  keyboardFocus: true,
  colorBlindMode: 'none'
})

const colorBlindOptions = [
  { value: 'none', label: 'None' },
  { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
  { value: 'protanopia', label: 'Protanopia (Red-blind)' },
  { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' },
  { value: 'achromatopsia', label: 'Achromatopsia (Monochrome)' }
]
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Vision</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">High Contrast</p>
            <p class="text-sm text-gray-500">Increase contrast for better visibility</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="settings.highContrast" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Large Text</p>
            <p class="text-sm text-gray-500">Increase text size throughout the app</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="settings.largeText" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium">Color Blind Mode</label>
          <select v-model="settings.colorBlindMode" class="w-full px-3 py-2 border rounded-lg">
            <option v-for="opt in colorBlindOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <p class="text-xs text-gray-500">Adjust colors to accommodate different types of color blindness</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Motion</h2>
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">Reduce Motion</p>
          <p class="text-sm text-gray-500">Minimize animations and transitions</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="settings.reduceMotion" type="checkbox" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
        </label>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Screen Reader</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Screen Reader Optimizations</p>
            <p class="text-sm text-gray-500">Enhance compatibility with screen readers</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="settings.screenReader" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Keyboard Focus Indicator</p>
            <p class="text-sm text-gray-500">Show visible focus indicator for keyboard navigation</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="settings.keyboardFocus" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
      </div>
    </div>

    <div class="bg-gray-50 rounded-lg p-6 text-center">
      <h3 class="font-semibold">Accessibility Statement</h3>
      <p class="mt-2 text-sm text-gray-500">We are committed to making our product accessible to everyone. If you encounter any issues, please contact our support team.</p>
      <button class="mt-4 px-4 py-2 border rounded hover:bg-gray-50">Contact Support</button>
    </div>
  </div>
</template>
