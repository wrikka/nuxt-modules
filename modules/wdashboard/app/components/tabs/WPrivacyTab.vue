<script setup lang="ts">
const privacySettings = ref({
  profileVisible: true,
  showEmail: false,
  showActivity: true,
  allowSearch: true,
  shareData: false,
  analyticsEnabled: true
})

const handleExportData = () => {
  console.log('Export data')
}

const handleDeleteData = () => {
  console.log('Delete data')
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Privacy Settings</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Public Profile</p>
            <p class="text-sm text-gray-500">Make your profile visible to everyone</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="privacySettings.profileVisible" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Show Email</p>
            <p class="text-sm text-gray-500">Display your email on your profile</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="privacySettings.showEmail" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Show Activity</p>
            <p class="text-sm text-gray-500">Show your recent activity to others</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="privacySettings.showActivity" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Allow Search</p>
            <p class="text-sm text-gray-500">Allow others to find you by name or email</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="privacySettings.allowSearch" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Data Sharing</p>
            <p class="text-sm text-gray-500">Share data with third-party partners</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="privacySettings.shareData" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Analytics</p>
            <p class="text-sm text-gray-500">Help improve our product with usage analytics</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="privacySettings.analyticsEnabled" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6 border-red-200">
      <h2 class="text-xl font-semibold text-red-600 mb-4">Data Control</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Export Your Data</p>
            <p class="text-sm text-gray-500">Download a copy of all your data</p>
          </div>
          <button class="px-4 py-2 border rounded hover:bg-gray-50" @click="handleExportData">Export</button>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-red-600">Delete All Data</p>
            <p class="text-sm text-gray-500">Permanently delete all your personal data</p>
          </div>
          <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" @click="handleDeleteData">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
