<script setup lang="ts">
const twoFactorEnabled = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const sessions = ref([
  { id: 1, device: 'Chrome on Windows', location: 'Bangkok, Thailand', lastActive: 'Now', current: true },
  { id: 2, device: 'Safari on iPhone', location: 'Bangkok, Thailand', lastActive: '2 hours ago', current: false },
  { id: 3, device: 'Firefox on macOS', location: 'Tokyo, Japan', lastActive: '3 days ago', current: false }
])

const isChangingPassword = ref(false)

const handleChangePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    return
  }
  isChangingPassword.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } finally {
    isChangingPassword.value = false
  }
}

const handleRevokeSession = (sessionId: number) => {
  sessions.value = sessions.value.filter(s => s.id !== sessionId)
}

const handleSetup2FA = () => {
  console.log('Setup 2FA')
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Password</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Current Password</label>
          <input v-model="currentPassword" type="password" class="w-full px-3 py-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">New Password</label>
          <input v-model="newPassword" type="password" class="w-full px-3 py-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Confirm New Password</label>
          <input v-model="confirmPassword" type="password" class="w-full px-3 py-2 border rounded-lg">
          <p v-if="newPassword !== confirmPassword && confirmPassword" class="text-red-500 text-sm mt-1">Passwords do not match</p>
        </div>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          :disabled="!currentPassword || !newPassword || newPassword !== confirmPassword || isChangingPassword"
          @click="handleChangePassword"
        >
          {{ isChangingPassword ? 'Changing...' : 'Change Password' }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Two-Factor Authentication</h2>
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">Two-Factor Authentication</p>
          <p class="text-sm text-gray-500">Add an extra layer of security to your account</p>
        </div>
        <button
          class="px-4 py-2 border rounded hover:bg-gray-50"
          :class="twoFactorEnabled ? 'bg-gray-100' : 'bg-blue-600 text-white'"
          @click="twoFactorEnabled ? twoFactorEnabled = false : handleSetup2FA()"
        >
          {{ twoFactorEnabled ? 'Disable' : 'Enable' }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Active Sessions</h2>
      <div class="space-y-4">
        <div v-for="session in sessions" :key="session.id" class="flex items-center justify-between rounded-lg border p-4">
          <div>
            <div class="flex items-center gap-2">
              <p class="font-medium">{{ session.device }}</p>
              <span v-if="session.current" class="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Current</span>
            </div>
            <p class="text-sm text-gray-500">{{ session.location }} · {{ session.lastActive }}</p>
          </div>
          <button v-if="!session.current" class="px-3 py-1 text-sm border rounded hover:bg-gray-50" @click="handleRevokeSession(session.id)">Revoke</button>
        </div>
      </div>
    </div>
  </div>
</template>
