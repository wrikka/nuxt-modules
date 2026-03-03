<script setup lang="ts">
const settings = ref({
  theme: 'system',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  sidebarCollapsed: false,
  autoSave: true,
  compactMode: false
})

const themes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' }
]

const dateFormats = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
]

const timeFormats = [
  { value: '12h', label: '12-hour' },
  { value: '24h', label: '24-hour' }
]
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Appearance</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Theme</label>
          <div class="grid gap-2 md:grid-cols-3">
            <label v-for="theme in themes" :key="theme.value" class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 has-[:checked]:border-blue-600">
              <input v-model="settings.theme" type="radio" :value="theme.value">
              <span>{{ theme.label }}</span>
            </label>
          </div>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Compact Mode</p>
            <p class="text-sm text-gray-500">Reduce spacing and font sizes</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="settings.compactMode" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Collapsed Sidebar</p>
            <p class="text-sm text-gray-500">Keep sidebar collapsed by default</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="settings.sidebarCollapsed" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Regional</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="block text-sm font-medium mb-1">Language</label>
          <select v-model="settings.language" class="w-full px-3 py-2 border rounded-lg">
            <option value="en">English</option>
            <option value="th">Thai</option>
            <option value="ja">Japanese</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Date Format</label>
          <select v-model="settings.dateFormat" class="w-full px-3 py-2 border rounded-lg">
            <option v-for="fmt in dateFormats" :key="fmt.value" :value="fmt.value">{{ fmt.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Time Format</label>
          <select v-model="settings.timeFormat" class="w-full px-3 py-2 border rounded-lg">
            <option v-for="fmt in timeFormats" :key="fmt.value" :value="fmt.value">{{ fmt.label }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Editor</h2>
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">Auto Save</p>
          <p class="text-sm text-gray-500">Automatically save changes</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="settings.autoSave" type="checkbox" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
        </label>
      </div>
    </div>

    <div class="flex justify-end">
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Settings</button>
    </div>
  </div>
</template>
