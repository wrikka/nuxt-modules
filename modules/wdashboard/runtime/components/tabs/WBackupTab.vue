<script setup lang="ts">
const backups = ref([
  { id: 1, name: 'Daily Backup', date: '2024-01-15 03:00', size: '156 MB', type: 'Automatic', status: 'completed' },
  { id: 2, name: 'Manual Backup', date: '2024-01-10 14:30', size: '148 MB', type: 'Manual', status: 'completed' },
  { id: 3, name: 'Daily Backup', date: '2024-01-14 03:00', size: '152 MB', type: 'Automatic', status: 'completed' }
])

const settings = ref({
  autoBackup: true,
  frequency: 'daily',
  keepCount: 7,
  includeMedia: true,
  includeSettings: true,
  includeData: true
})

const isCreatingBackup = ref(false)

const handleCreateBackup = async () => {
  isCreatingBackup.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 3000))
    backups.value.unshift({
      id: Date.now(),
      name: 'Manual Backup',
      date: new Date().toISOString().replace('T', ' ').split('.')[0],
      size: '160 MB',
      type: 'Manual',
      status: 'completed'
    })
  } finally {
    isCreatingBackup.value = false
  }
}

const handleRestore = (backupId: number) => {
  console.log('Restore backup', backupId)
}

const handleDelete = (backupId: number) => {
  backups.value = backups.value.filter(b => b.id !== backupId)
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Backup Settings</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Automatic Backup</p>
            <p class="text-sm text-gray-500">Create backups automatically</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="settings.autoBackup" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium mb-1">Backup Frequency</label>
            <select v-model="settings.frequency" class="w-full px-3 py-2 border rounded-lg" :disabled="!settings.autoBackup">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Keep Backups</label>
            <select v-model="settings.keepCount" class="w-full px-3 py-2 border rounded-lg" :disabled="!settings.autoBackup">
              <option :value="7">7 days</option>
              <option :value="14">14 days</option>
              <option :value="30">30 days</option>
              <option :value="90">90 days</option>
            </select>
          </div>
        </div>
        <hr>
        <p class="text-sm font-medium">Backup Contents</p>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-lg">🗄</span>
              <span class="text-sm">Application Data</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="settings.includeData" type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-lg">⚙</span>
              <span class="text-sm">User Settings</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="settings.includeSettings" type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-lg">🖼</span>
              <span class="text-sm">Media Files</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="settings.includeMedia" type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Backup History</h2>
        <button class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" :disabled="isCreatingBackup" @click="handleCreateBackup">{{ isCreatingBackup ? 'Creating...' : 'Create Backup' }}</button>
      </div>
      <div class="space-y-4">
        <div v-for="backup in backups" :key="backup.id" class="rounded-lg border p-4">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl">{{ backup.type === 'Automatic' ? '⏰' : '💾' }}</div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="font-medium">{{ backup.name }}</p>
                  <span class="px-2 py-0.5 text-xs rounded-full" :class="backup.type === 'Automatic' ? 'bg-gray-100' : 'bg-blue-100 text-blue-800'">{{ backup.type }}</span>
                </div>
                <p class="text-sm text-gray-500">{{ backup.date }} · {{ backup.size }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button class="px-3 py-1 text-sm hover:bg-gray-50" @click="handleRestore(backup.id)">Restore</button>
              <button class="px-3 py-1 text-sm hover:bg-gray-50" @click="handleDelete(backup.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
