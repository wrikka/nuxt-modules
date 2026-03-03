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

const route = useRoute()
const activeTab = computed(() => {
  // Extract tab id from route, default to 'profile'
  const pathSegments = route.path.split('/')
  const lastSegment = pathSegments[pathSegments.length - 1]
  return tabs.find(t => t.id === lastSegment)?.id || 'profile'
})

const activeTabComponent = computed(() => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab?.component || 'WProfileTab'
})
</script>

<template>
  <div class="flex min-h-screen flex-col lg:flex-row">
    <!-- Sidebar -->
    <aside class="w-full border-r bg-card lg:w-64 lg:min-h-screen">
      <div class="p-4">
        <h1 class="text-lg font-semibold">
          Dashboard
        </h1>
        <p class="text-sm text-muted-foreground">
          Manage your account
        </p>
      </div>

      <nav class="space-y-1 p-2">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.id"
          :to="`/tabs/${tab.id}`"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
          :class="activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
        >
          <div class="h-4 w-4" :class="tab.icon" />
          {{ tab.label }}
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6">
      <div class="mx-auto max-w-4xl">
        <slot />
      </div>
    </main>
  </div>
</template>
