<script setup lang="ts">
const devices = ref([
  { id: 1, name: 'Windows PC', type: 'desktop', browser: 'Chrome 120', os: 'Windows 11', lastActive: 'Now', current: true },
  { id: 2, name: 'iPhone 15', type: 'mobile', browser: 'Safari', os: 'iOS 17', lastActive: '2 hours ago', current: false },
  { id: 3, name: 'MacBook Pro', type: 'desktop', browser: 'Firefox 121', os: 'macOS 14', lastActive: '3 days ago', current: false }
])

const trustedDevices = ref([1, 2])

const handleRevoke = (deviceId: number) => {
  devices.value = devices.value.filter(d => d.id !== deviceId)
}

const handleLogoutAll = () => {
  devices.value = devices.value.filter(d => d.current)
}

const toggleTrusted = (deviceId: number) => {
  const index = trustedDevices.value.indexOf(deviceId)
  if (index > -1) {
    trustedDevices.value.splice(index, 1)
  } else {
    trustedDevices.value.push(deviceId)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Active Devices</h2>
        <button class="px-4 py-2 border rounded hover:bg-gray-50" @click="handleLogoutAll">Logout All Others</button>
      </div>
      <div class="space-y-4">
        <div v-for="device in devices" :key="device.id" class="rounded-lg border p-4">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">
                {{ device.type === 'mobile' ? '📱' : '🖥' }}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="font-medium">{{ device.name }}</p>
                  <span v-if="device.current" class="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Current</span>
                  <span v-if="trustedDevices.includes(device.id)" class="px-2 py-0.5 text-xs bg-gray-100 rounded-full">Trusted</span>
                </div>
                <p class="text-sm text-gray-500">{{ device.browser }} · {{ device.os }}</p>
                <p class="text-sm text-gray-500">Last active: {{ device.lastActive }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button class="px-3 py-1 text-sm hover:bg-gray-50" @click="toggleTrusted(device.id)">{{ trustedDevices.includes(device.id) ? 'Remove Trust' : 'Trust Device' }}</button>
              <button v-if="!device.current" class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700" @click="handleRevoke(device.id)">Revoke</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Device Security</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Require 2FA for New Devices</p>
            <p class="text-sm text-gray-500">Always require 2FA when logging in from a new device</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Email Notifications</p>
            <p class="text-sm text-gray-500">Get notified when a new device logs in</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Auto-logout Inactive Devices</p>
            <p class="text-sm text-gray-500">Automatically logout devices inactive for 30 days</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
