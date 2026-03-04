<script setup lang="ts">
const appInfo = ref({
  name: 'W Dashboard',
  version: '1.0.0',
  build: '2024.01.15',
  environment: 'Production'
})

const credits = [
  { name: 'Vue.js', url: 'https://vuejs.org', license: 'MIT' },
  { name: 'Nuxt', url: 'https://nuxt.com', license: 'MIT' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com', license: 'MIT' },
  { name: 'UnoCSS', url: 'https://unocss.dev', license: 'MIT' }
]

const links = [
  { title: 'Terms of Service', href: '/terms' },
  { title: 'Privacy Policy', href: '/privacy' },
  { title: 'Cookie Policy', href: '/cookies' },
  { title: 'License', href: '/license' }
]
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">W</div>
        <div>
          <h2 class="text-xl font-semibold">{{ appInfo.name }}</h2>
          <p class="text-sm text-gray-500">Version {{ appInfo.version }} ({{ appInfo.build }})</p>
        </div>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-lg bg-gray-50 p-4">
          <p class="text-sm text-gray-500">Environment</p>
          <p class="font-medium">{{ appInfo.environment }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4">
          <p class="text-sm text-gray-500">Build Date</p>
          <p class="font-medium">{{ appInfo.build }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Legal</h2>
      <div class="space-y-2">
        <a v-for="link in links" :key="link.title" :href="link.href" class="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
          <span class="font-medium">{{ link.title }}</span>
          <span class="text-gray-400">→</span>
        </a>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Open Source Credits</h2>
      <div class="space-y-2">
        <div v-for="credit in credits" :key="credit.name" class="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p class="font-medium">{{ credit.name }}</p>
            <p class="text-sm text-gray-500">{{ credit.license }} License</p>
          </div>
          <a :href="credit.url" target="_blank" class="text-sm text-blue-600 hover:underline">Visit</a>
        </div>
      </div>
    </div>

    <div class="text-center text-sm text-gray-500">
      <p>© 2024 W Dashboard. All rights reserved.</p>
      <p class="mt-1">Made with ❤️ by Wrikka Team</p>
    </div>
  </div>
</template>
