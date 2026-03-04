export interface Tab {
  id: string
  label: string
  icon: string
  component: string
}

export type Theme = 'light' | 'dark' | 'system'

export interface DashboardState {
  activeTab: string
  sidebarCollapsed: boolean
  theme: Theme
  isLoading: boolean
}

export interface UserProfile {
  name: string
  email: string
  avatar: string
  bio: string
  phone: string
  location: string
  website: string
}

export interface AccountInfo {
  username: string
  accountType: 'personal' | 'business' | 'enterprise'
  status: 'active' | 'suspended' | 'pending'
  createdAt: string
  language: string
  timezone: string
}

export interface PrivacySettings {
  profileVisible: boolean
  showEmail: boolean
  showActivity: boolean
  allowSearch: boolean
  shareData: boolean
  analyticsEnabled: boolean
}

export interface NotificationSettings {
  email: {
    marketing: boolean
    productUpdates: boolean
    security: boolean
    newsletter: boolean
  }
  push: {
    mentions: boolean
    messages: boolean
    comments: boolean
    reminders: boolean
  }
  inApp: {
    achievements: boolean
    suggestions: boolean
    tips: boolean
  }
}

export interface AppSettings {
  theme: Theme
  language: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  sidebarCollapsed: boolean
  autoSave: boolean
  compactMode: boolean
}

export interface AccessibilitySettings {
  highContrast: boolean
  reduceMotion: boolean
  largeText: boolean
  screenReader: boolean
  keyboardFocus: boolean
  colorBlindMode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'achromatopsia'
}

export interface BackupSettings {
  autoBackup: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  keepCount: number
  includeMedia: boolean
  includeSettings: boolean
  includeData: boolean
}

export interface Device {
  id: number
  name: string
  type: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
  lastActive: string
  current: boolean
}

export interface Session {
  id: number
  device: string
  location: string
  lastActive: string
  current: boolean
}

export interface Activity {
  id: number
  action: string
  device: string
  location: string
  time: string
  icon: string
}

export interface PaymentMethod {
  id: number
  type: 'card' | 'paypal' | 'bank'
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  pdf: string
}

export interface Plan {
  name: string
  price: number
  billingCycle: 'monthly' | 'yearly'
  nextBilling: string
  status: 'active' | 'cancelled' | 'suspended'
}

export interface Backup {
  id: number
  name: string
  date: string
  size: string
  type: 'Automatic' | 'Manual'
  status: 'completed' | 'failed' | 'in_progress'
}

export interface ExportItem {
  id: number
  type: string
  format: 'JSON' | 'CSV' | 'PDF' | 'ZIP'
  date: string
  status: 'completed' | 'expired' | 'failed'
}

export interface DataUsage {
  total: number
  used: number
  unit: 'GB' | 'MB' | 'TB'
}

export interface FAQCategory {
  id: string
  title: string
  articles: {
    title: string
    views: number
  }[]
}

export interface ContactMethod {
  icon: string
  title: string
  description: string
  href?: string
  action?: string
}

export interface AppInfo {
  name: string
  version: string
  build: string
  environment: 'Development' | 'Staging' | 'Production'
}

export interface OpenSourceCredit {
  name: string
  url: string
  license: string
}

export interface LegalLink {
  title: string
  href: string
}
