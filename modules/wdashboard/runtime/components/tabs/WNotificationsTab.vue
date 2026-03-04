<script setup lang="ts">
const notifications = ref({
  email: {
    marketing: false,
    productUpdates: true,
    security: true,
    newsletter: false
  },
  push: {
    mentions: true,
    messages: true,
    comments: false,
    reminders: true
  },
  inApp: {
    achievements: true,
    suggestions: false,
    tips: true
  }
})

const emailDigest = ref('daily')
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Email Notifications</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Marketing Emails</p>
            <p class="text-sm text-gray-500">Receive emails about new products and features</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.email.marketing" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Product Updates</p>
            <p class="text-sm text-gray-500">Get notified about new features and improvements</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.email.productUpdates" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Security Alerts</p>
            <p class="text-sm text-gray-500">Important security notifications</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.email.security" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Newsletter</p>
            <p class="text-sm text-gray-500">Weekly newsletter with tips and news</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.email.newsletter" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div>
          <label class="block text-sm font-medium mb-1">Email Digest Frequency</label>
          <select v-model="emailDigest" class="w-full px-3 py-2 border rounded-lg">
            <option value="instant">Instant</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Push Notifications</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Mentions</p>
            <p class="text-sm text-gray-500">When someone mentions you</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.push.mentions" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Direct Messages</p>
            <p class="text-sm text-gray-500">New message notifications</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.push.messages" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Comments</p>
            <p class="text-sm text-gray-500">New comments on your posts</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.push.comments" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Reminders</p>
            <p class="text-sm text-gray-500">Task and event reminders</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.push.reminders" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">In-App Notifications</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Achievements</p>
            <p class="text-sm text-gray-500">Unlock and progress updates</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.inApp.achievements" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Suggestions</p>
            <p class="text-sm text-gray-500">Personalized recommendations</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.inApp.suggestions" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        <hr>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Tips & Tutorials</p>
            <p class="text-sm text-gray-500">Helpful tips to get started</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.inApp.tips" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
