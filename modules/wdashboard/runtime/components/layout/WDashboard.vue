<script setup lang="ts">
const activeTab = ref('profile')

const tabs = [
  { id: 'profile', label: 'Profile', icon: 'i-lucide-user' },
  { id: 'account', label: 'Account', icon: 'i-lucide-settings-2' },
  { id: 'security', label: 'Security', icon: 'i-lucide-shield' },
  { id: 'privacy', label: 'Privacy', icon: 'i-lucide-eye-off' },
  { id: 'data', label: 'Data', icon: 'i-lucide-database' },
  { id: 'settings', label: 'Settings', icon: 'i-lucide-cog' },
  { id: 'notifications', label: 'Notifications', icon: 'i-lucide-bell' },
  { id: 'billing', label: 'Billing', icon: 'i-lucide-credit-card' },
  { id: 'activity', label: 'Activity', icon: 'i-lucide-activity' },
  { id: 'devices', label: 'Devices', icon: 'i-lucide-monitor' },
  { id: 'accessibility', label: 'Accessibility', icon: 'i-lucide-accessibility' },
  { id: 'backup', label: 'Backup', icon: 'i-lucide-save' },
  { id: 'help', label: 'Help', icon: 'i-lucide-help-circle' },
  { id: 'about', label: 'About', icon: 'i-lucide-info' }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r">
        <div class="p-4 border-b">
          <h1 class="text-lg font-semibold">Dashboard</h1>
          <p class="text-sm text-gray-500">Manage your account</p>
        </div>
        <nav class="p-2 space-y-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left"
            :class="activeTab === tab.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'"
            @click="activeTab = tab.id"
          >
            <span class="w-4 h-4" :class="tab.icon" />
            {{ tab.label }}
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <h2 class="text-2xl font-bold mb-6 capitalize">
          {{ tabs.find(t => t.id === activeTab)?.label }}
        </h2>

        <!-- Tab Components -->
        <WProfileTab v-if="activeTab === 'profile'" />
        <WAccountTab v-else-if="activeTab === 'account'" />
        <WSecurityTab v-else-if="activeTab === 'security'" />
        <WPrivacyTab v-else-if="activeTab === 'privacy'" />
        <WDataTab v-else-if="activeTab === 'data'" />
        <WSettingsTab v-else-if="activeTab === 'settings'" />
        <WNotificationsTab v-else-if="activeTab === 'notifications'" />
        <WBillingTab v-else-if="activeTab === 'billing'" />
        <WActivityTab v-else-if="activeTab === 'activity'" />
        <WDevicesTab v-else-if="activeTab === 'devices'" />
        <WAccessibilityTab v-else-if="activeTab === 'accessibility'" />
        <WBackupTab v-else-if="activeTab === 'backup'" />
        <WHelpTab v-else-if="activeTab === 'help'" />
        <WAboutTab v-else-if="activeTab === 'about'" />
      </main>
    </div>
  </div>
</template>
