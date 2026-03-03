<script setup lang="ts">
interface Tab {
  id: string
  label: string
  icon: string
  component: string
}

const tabs: Tab[] = [
  { id: 'profile', label: 'Profile', icon: 'i-lucide-user', component: 'WProfileTab' },
  { id: 'account', label: 'Account', icon: 'i-lucide-settings-2', component: 'WAccountTab' },
  { id: 'security', label: 'Security', icon: 'i-lucide-shield', component: 'WSecurityTab' },
  { id: 'privacy', label: 'Privacy', icon: 'i-lucide-eye-off', component: 'WPrivacyTab' },
  { id: 'data', label: 'Data', icon: 'i-lucide-database', component: 'WDataTab' },
  { id: 'settings', label: 'Settings', icon: 'i-lucide-cog', component: 'WSettingsTab' },
  { id: 'notifications', label: 'Notifications', icon: 'i-lucide-bell', component: 'WNotificationsTab' },
  { id: 'billing', label: 'Billing', icon: 'i-lucide-credit-card', component: 'WBillingTab' },
  { id: 'activity', label: 'Activity', icon: 'i-lucide-activity', component: 'WActivityTab' },
  { id: 'devices', label: 'Devices', icon: 'i-lucide-monitor', component: 'WDevicesTab' },
  { id: 'accessibility', label: 'Accessibility', icon: 'i-lucide-accessibility', component: 'WAccessibilityTab' },
  { id: 'backup', label: 'Backup', icon: 'i-lucide-save', component: 'WBackupTab' },
  { id: 'help', label: 'Help', icon: 'i-lucide-help-circle', component: 'WHelpTab' },
  { id: 'about', label: 'About', icon: 'i-lucide-info', component: 'WAboutTab' }
]

const activeTab = ref('profile')
const activeTabComponent = computed(() => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab?.component || 'WProfileTab'
})
</script>

<template>
  <div class="flex min-h-screen flex-col lg:flex-row bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-full border-r bg-white lg:w-64 lg:min-h-screen">
      <div class="p-4 border-b">
        <h1 class="text-lg font-semibold">Dashboard</h1>
        <p class="text-sm text-gray-500">Manage your account</p>
      </div>

      <nav class="space-y-1 p-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
          :class="activeTab === tab.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'"
          @click="activeTab = tab.id"
        >
          <span class="text-lg">{{ tab.icon.includes('user') ? '👤' : tab.icon.includes('settings') ? '⚙' : tab.icon.includes('shield') ? '🛡' : tab.icon.includes('eye') ? '👁' : tab.icon.includes('database') ? '🗄' : tab.icon.includes('cog') ? '⚙' : tab.icon.includes('bell') ? '🔔' : tab.icon.includes('credit') ? '💳' : tab.icon.includes('activity') ? '📊' : tab.icon.includes('monitor') ? '🖥' : tab.icon.includes('accessibility') ? '♿' : tab.icon.includes('save') ? '💾' : tab.icon.includes('help') ? '❓' : 'ℹ' }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6">
      <div class="mx-auto max-w-4xl">
        <h2 class="mb-6 text-2xl font-bold capitalize">
          {{ tabs.find(t => t.id === activeTab)?.label }}
        </h2>

        <component :is="activeTabComponent" />
      </div>
    </main>
  </div>
</template>
