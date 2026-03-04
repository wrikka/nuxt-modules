<script setup lang="ts">
const { tabs, activeTab, activeTabComponent, setActiveTab, sidebarCollapsed, toggleSidebar } = useDashboard()
const { isDark, toggleTheme } = useTheme()

const getIcon = (icon: string): string => {
  const iconMap: Record<string, string> = {
    'i-lucide-user': '👤',
    'i-lucide-settings-2': '⚙',
    'i-lucide-shield': '🛡',
    'i-lucide-eye-off': '👁',
    'i-lucide-database': '🗄',
    'i-lucide-cog': '⚙',
    'i-lucide-bell': '🔔',
    'i-lucide-credit-card': '💳',
    'i-lucide-activity': '📊',
    'i-lucide-monitor': '🖥',
    'i-lucide-accessibility': '♿',
    'i-lucide-save': '💾',
    'i-lucide-help-circle': '❓',
    'i-lucide-info': 'ℹ'
  }
  return iconMap[icon] ?? '•'
}
</script>

<template>
  <div class="flex min-h-screen flex-col lg:flex-row bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Mobile Header -->
    <div class="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div>
        <h1 class="text-lg font-semibold dark:text-white">Dashboard</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manage your account</p>
      </div>
      <button
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        @click="toggleSidebar"
      >
        <span class="text-xl">☰</span>
      </button>
    </div>

    <!-- Sidebar -->
    <aside
      class="w-full border-r bg-white dark:bg-gray-800 dark:border-gray-700 lg:w-64 lg:min-h-screen transition-all"
      :class="{ 'hidden lg:block': sidebarCollapsed }"
    >
      <div class="p-4 border-b dark:border-gray-700 flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold dark:text-white">Dashboard</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">Manage your account</p>
        </div>
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="toggleTheme"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <span class="text-xl">{{ isDark ? '☀' : '🌙' }}</span>
        </button>
      </div>

      <nav class="space-y-1 p-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
          :class="activeTab === tab.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'"
          @click="setActiveTab(tab.id)"
        >
          <span class="text-lg">{{ getIcon(tab.icon) }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 dark:bg-gray-900">
      <div class="mx-auto max-w-4xl">
        <h2 class="mb-6 text-2xl font-bold capitalize dark:text-white">
          {{ tabs.find((t) => t.id === activeTab)?.label }}
        </h2>

        <component :is="activeTabComponent" />
      </div>
    </main>
  </div>
</template>
