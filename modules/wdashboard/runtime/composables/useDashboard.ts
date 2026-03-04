import type { Ref } from 'vue'

export interface Tab {
  id: string
  label: string
  icon: string
  component: string
}

export interface DashboardState {
  activeTab: string
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'
  isLoading: boolean
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

export function useDashboard(): {
  tabs: Tab[]
  activeTab: Ref<string>
  sidebarCollapsed: Ref<boolean>
  theme: Ref<'light' | 'dark' | 'system'>
  isLoading: Ref<boolean>
  activeTabComponent: import('vue').ComputedRef<string>
  setActiveTab: (tabId: string) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
} {
  const activeTab = useState<string>('dashboard-active-tab', () => 'profile')
  const sidebarCollapsed = useState<boolean>('dashboard-sidebar-collapsed', () => false)
  const theme = useState<DashboardState['theme']>('dashboard-theme', () => 'system')
  const isLoading = useState<boolean>('dashboard-loading', () => false)

  const activeTabComponent = computed(() => {
    const tab = tabs.find(t => t.id === activeTab.value)
    return tab?.component ?? 'WProfileTab'
  })

  const setActiveTab = (tabId: string): void => {
    const tab = tabs.find(t => t.id === tabId)
    if (tab) {
      activeTab.value = tabId
    }
  }

  const toggleSidebar = (): void => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setTheme = (newTheme: 'light' | 'dark' | 'system'): void => {
    theme.value = newTheme
  }

  return {
    tabs,
    activeTab,
    sidebarCollapsed,
    theme,
    isLoading,
    activeTabComponent,
    setActiveTab,
    toggleSidebar,
    setTheme
  }
}
