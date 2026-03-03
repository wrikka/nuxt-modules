<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const tabId = route.params.id as string

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

const currentTab = computed(() => tabs.find(t => t.id === tabId))
const activeTabComponent = computed(() => {
  const tab = tabs.find(t => t.id === tabId)
  return tab?.component || 'WProfileTab'
})

// Redirect to dashboard if tab not found
if (!currentTab.value) {
  navigateTo('/dashboard')
}
</script>

<template>
  <div>
    <h2 class="mb-6 text-2xl font-bold capitalize">
      {{ currentTab?.label }}
    </h2>

    <component :is="activeTabComponent" />
  </div>
</template>
