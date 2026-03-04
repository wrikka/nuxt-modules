<script setup lang="ts">
const activities = ref([
  { id: 1, action: 'Logged in', device: 'Chrome on Windows', location: 'Bangkok, Thailand', time: '2 minutes ago', icon: 'i-lucide-log-in' },
  { id: 2, action: 'Changed password', device: 'Safari on iPhone', location: 'Bangkok, Thailand', time: '2 hours ago', icon: 'i-lucide-key' },
  { id: 3, action: 'Updated profile', device: 'Chrome on Windows', location: 'Bangkok, Thailand', time: '1 day ago', icon: 'i-lucide-user' },
  { id: 4, action: 'Exported data', device: 'Firefox on macOS', location: 'Tokyo, Japan', time: '3 days ago', icon: 'i-lucide-download' },
  { id: 5, action: 'Enabled 2FA', device: 'Chrome on Windows', location: 'Bangkok, Thailand', time: '1 week ago', icon: 'i-lucide-shield' }
])

const stats = ref({
  totalLogins: 156,
  uniqueDevices: 4,
  lastPasswordChange: '2024-01-10',
  dataExports: 12
})

const filter = ref('all')
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Activity Overview</h2>
      <div class="grid gap-4 md:grid-cols-4">
        <div v-for="(value, key) in { totalLogins: stats.totalLogins, uniqueDevices: stats.uniqueDevices, dataExports: stats.dataExports, lastPasswordChange: stats.lastPasswordChange }" :key="key" class="rounded-lg bg-gray-50 p-4 text-center">
          <p class="text-2xl font-bold">{{ value }}</p>
          <p class="text-sm text-gray-500">{{ key === 'totalLogins' ? 'Total Logins' : key === 'uniqueDevices' ? 'Devices' : key === 'dataExports' ? 'Data Exports' : 'Last Password Change' }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Recent Activity</h2>
        <select v-model="filter" class="px-3 py-2 border rounded-lg w-40">
          <option value="all">All Activity</option>
          <option value="login">Logins</option>
          <option value="security">Security</option>
          <option value="data">Data</option>
        </select>
      </div>
      <div class="space-y-4">
        <div v-for="activity in activities" :key="activity.id" class="flex items-start gap-4 rounded-lg border p-4">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl">
            {{ activity.icon.includes('log-in') ? '🔑' : activity.icon.includes('key') ? '🔐' : activity.icon.includes('user') ? '👤' : activity.icon.includes('download') ? '⬇' : '🛡' }}
          </div>
          <div class="flex-1">
            <p class="font-medium">{{ activity.action }}</p>
            <p class="text-sm text-gray-500">{{ activity.device }} · {{ activity.location }}</p>
          </div>
          <p class="text-sm text-gray-500">{{ activity.time }}</p>
        </div>
      </div>
      <div class="mt-4 flex justify-center">
        <button class="px-4 py-2 border rounded hover:bg-gray-50">Load More</button>
      </div>
    </div>

    <div class="bg-gray-50 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold">Export Activity Log</h3>
          <p class="text-sm text-gray-500">Download a copy of your activity history</p>
        </div>
        <button class="px-4 py-2 border rounded hover:bg-gray-50">Export</button>
      </div>
    </div>
  </div>
</template>
