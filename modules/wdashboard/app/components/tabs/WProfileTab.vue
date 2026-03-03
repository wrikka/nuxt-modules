<script setup lang="ts">
interface UserProfile {
  name: string
  email: string
  avatar: string
  bio: string
  phone: string
  location: string
  website: string
}

const profile = ref<UserProfile>({
  name: '',
  email: '',
  avatar: '',
  bio: '',
  phone: '',
  location: '',
  website: ''
})

const isEditing = ref(false)
const isSaving = ref(false)

const handleSave = async () => {
  isSaving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    isEditing.value = false
  } finally {
    isSaving.value = false
  }
}

const handleAvatarChange = () => {
  console.log('Avatar change requested')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold">Profile</h2>
      <button
        class="px-3 py-1 text-sm border rounded hover:bg-gray-50"
        @click="isEditing = !isEditing"
      >
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </button>
    </div>

    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
          {{ profile.name.charAt(0) || '?' }}
        </div>
        <div v-if="isEditing">
          <button class="px-3 py-1 text-sm border rounded hover:bg-gray-50" @click="handleAvatarChange">
            Change Photo
          </button>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="block text-sm font-medium mb-1">Full Name</label>
          <input v-model="profile.name" class="w-full px-3 py-2 border rounded-lg" :disabled="!isEditing">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input v-model="profile.email" type="email" class="w-full px-3 py-2 border rounded-lg" :disabled="!isEditing">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Phone</label>
          <input v-model="profile.phone" class="w-full px-3 py-2 border rounded-lg" :disabled="!isEditing">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Location</label>
          <input v-model="profile.location" class="w-full px-3 py-2 border rounded-lg" :disabled="!isEditing">
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Website</label>
        <input v-model="profile.website" class="w-full px-3 py-2 border rounded-lg" :disabled="!isEditing">
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Bio</label>
        <textarea v-model="profile.bio" rows="4" class="w-full px-3 py-2 border rounded-lg" :disabled="!isEditing" />
      </div>

      <div v-if="isEditing" class="flex justify-end gap-2">
        <button class="px-4 py-2 border rounded hover:bg-gray-50" @click="isEditing = false">Cancel</button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" @click="handleSave">Save</button>
      </div>
    </div>
  </div>
</template>
