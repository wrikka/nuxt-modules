<script setup lang="ts">
interface AccountInfo {
  username: string
  accountType: 'personal' | 'business' | 'enterprise'
  status: 'active' | 'suspended' | 'pending'
  createdAt: string
  language: string
  timezone: string
}

const account = ref<AccountInfo>({
  username: '',
  accountType: 'personal',
  status: 'active',
  createdAt: '2024-01-01',
  language: 'en',
  timezone: 'UTC'
})

const languages = [
  { value: 'en', label: 'English' },
  { value: 'th', label: 'Thai' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' }
]

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Asia/Bangkok', label: 'Bangkok' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'America/New_York', label: 'New York' }
]

const handleDeactivate = () => {
  console.log('Deactivate account')
}

const handleDelete = () => {
  console.log('Delete account')
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Account Information</h2>
      <div class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium mb-1">Username</label>
            <input v-model="account.username" class="w-full px-3 py-2 border rounded-lg" placeholder="@username">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Account Type</label>
            <select v-model="account.accountType" class="w-full px-3 py-2 border rounded-lg">
              <option value="personal">Personal</option>
              <option value="business">Business</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium mb-1">Language</label>
            <select v-model="account.language" class="w-full px-3 py-2 border rounded-lg">
              <option v-for="lang in languages" :key="lang.value" :value="lang.value">{{ lang.label }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Timezone</label>
            <select v-model="account.timezone" class="w-full px-3 py-2 border rounded-lg">
              <option v-for="tz in timezones" :key="tz.value" :value="tz.value">{{ tz.label }}</option>
            </select>
          </div>
        </div>
        <div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div>
            <p class="font-medium">Account Status</p>
            <p class="text-sm text-gray-500">Member since {{ account.createdAt }}</p>
          </div>
          <span class="px-2 py-1 text-sm rounded-full" :class="account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">{{ account.status }}</span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6 border-red-200">
      <h2 class="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Deactivate Account</p>
            <p class="text-sm text-gray-500">Temporarily disable your account</p>
          </div>
          <button class="px-4 py-2 border rounded hover:bg-gray-50" @click="handleDeactivate">Deactivate</button>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-red-600">Delete Account</p>
            <p class="text-sm text-gray-500">Permanently delete your account and all data</p>
          </div>
          <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" @click="handleDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
