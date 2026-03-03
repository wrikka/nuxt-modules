<script setup lang="ts">
const searchQuery = ref('')

const faqCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    articles: [
      { title: 'Quick Start Guide', views: 1205 },
      { title: 'Setting up your account', views: 890 },
      { title: 'First steps', views: 756 }
    ]
  },
  {
    id: 'account',
    title: 'Account & Billing',
    articles: [
      { title: 'Change your plan', views: 543 },
      { title: 'Update payment method', views: 432 },
      { title: 'Cancel subscription', views: 321 }
    ]
  },
  {
    id: 'security',
    title: 'Security',
    articles: [
      { title: 'Enable two-factor authentication', views: 678 },
      { title: 'Reset your password', views: 567 },
      { title: 'Secure your account', views: 445 }
    ]
  }
]

const contactMethods = [
  { icon: 'i-lucide-mail', title: 'Email', description: 'support@example.com', href: 'mailto:support@example.com' },
  { icon: 'i-lucide-message-circle', title: 'Live Chat', description: 'Available 9am-6pm', action: 'Start Chat' },
  { icon: 'i-lucide-phone', title: 'Phone', description: '+1 (555) 123-4567', href: 'tel:+15551234567' }
]
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">How can we help?</h2>
      <div class="space-y-4">
        <input v-model="searchQuery" placeholder="Search for help articles..." class="w-full px-3 py-2 border rounded-lg">
        <div class="flex flex-wrap gap-2">
          <span class="px-2 py-1 text-sm bg-gray-100 rounded">Popular:</span>
          <button class="px-3 py-1 text-sm hover:bg-gray-50">Getting started</button>
          <button class="px-3 py-1 text-sm hover:bg-gray-50">Billing</button>
          <button class="px-3 py-1 text-sm hover:bg-gray-50">Security</button>
        </div>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div v-for="category in faqCategories" :key="category.id" class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow">
        <h3 class="font-semibold">{{ category.title }}</h3>
        <ul class="mt-4 space-y-2">
          <li v-for="article in category.articles" :key="article.title" class="flex items-center justify-between text-sm">
            <span class="text-gray-500 hover:text-gray-900">{{ article.title }}</span>
            <span class="text-xs text-gray-400">{{ article.views }} views</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Contact Support</h2>
      <div class="grid gap-4 md:grid-cols-3">
        <div v-for="method in contactMethods" :key="method.title" class="flex flex-col items-center rounded-lg border p-6 text-center">
          <div class="h-8 w-8 text-blue-600 text-2xl">{{ method.icon.includes('mail') ? '✉' : method.icon.includes('chat') ? '💬' : '📞' }}</div>
          <h4 class="mt-4 font-medium">{{ method.title }}</h4>
          <p class="text-sm text-gray-500">{{ method.description }}</p>
          <button v-if="method.action" class="mt-4 px-3 py-1 text-sm border rounded hover:bg-gray-50">{{ method.action }}</button>
          <a v-else-if="method.href" :href="method.href" class="mt-4 text-sm text-blue-600 hover:underline">{{ method.href.replace(/^mailto:|^tel:/, '') }}</a>
        </div>
      </div>
    </div>

    <div class="bg-gray-50 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold">Still need help?</h3>
          <p class="text-sm text-gray-500">Our support team is here to assist you</p>
        </div>
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create Ticket</button>
      </div>
    </div>
  </div>
</template>
