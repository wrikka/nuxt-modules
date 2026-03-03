// useApiKeyDashboard Composable
// Core logic for the API Key Dashboard

import { ref, computed } from 'vue'
import type {
  ApiKey,
  UsageDay,
  KeyForm,
  ApiKeyExpiration,
} from '../types/api-key'
import { AVAILABLE_PERMISSIONS } from '../types/api-key'

export function useApiKeyDashboard() {
  const showCreateModal = ref(false)
  const showKeyModal = ref(false)
  const editingKey = ref<ApiKey | null>(null)
  const newKey = ref("")

  const keyForm = ref<KeyForm>({
    name: "",
    description: "",
    permissions: [],
    rateLimit: 1000,
    expiration: "90d",
  })

  const apiKeys = ref<ApiKey[]>([
    {
      id: "1",
      name: "Production API",
      description: "Main production API key",
      key: "sk_live_abc123def456ghi789jkl",
      permissions: ["users.read", "users.write", "organizations.read", "audit.read"],
      usage: 45678,
      limit: 100000,
      status: "active",
      expiresAt: new Date(Date.now() + 7776000000),
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Development",
      description: "Development environment key",
      key: "sk_test_xyz789abc123def456ghi",
      permissions: ["users.read", "organizations.read"],
      usage: 1234,
      limit: 10000,
      status: "active",
      expiresAt: new Date(Date.now() + 2592000000),
      createdAt: new Date("2024-06-01"),
    },
    {
      id: "3",
      name: "Legacy Integration",
      description: "Old integration - to be deprecated",
      key: "sk_live_old123key456legacy789",
      permissions: ["users.read"],
      usage: 999,
      limit: 1000,
      status: "expired",
      expiresAt: new Date(Date.now() - 86400000),
      createdAt: new Date("2023-01-01"),
    },
  ])

  const usageData = ref<UsageDay[]>([
    { day: "Mon", requests: 12500 },
    { day: "Tue", requests: 15800 },
    { day: "Wed", requests: 18200 },
    { day: "Thu", requests: 14100 },
    { day: "Fri", requests: 16700 },
    { day: "Sat", requests: 8900 },
    { day: "Sun", requests: 7200 },
  ])

  const activeKeys = computed(() => apiKeys.value.filter(k => k.status === "active").length)
  const expiredKeys = computed(() => apiKeys.value.filter(k => k.status === "expired").length)
  const totalRequests = computed(() => apiKeys.value.reduce((sum, k) => sum + k.usage, 0))
  const maxRequests = computed(() => Math.max(...usageData.value.map(d => d.requests)))

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const maskKey = (key: string): string => {
    return `${key.slice(0, 12)}...${key.slice(-4)}`
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const isExpiringSoon = (date: Date): boolean => {
    const daysUntilExpiry = (date.getTime() - Date.now()) / 86400000
    return daysUntilExpiry > 0 && daysUntilExpiry < 30
  }

  const copyKey = async (key: string) => {
    await navigator.clipboard.writeText(key)
  }

  const editKey = (key: ApiKey) => {
    editingKey.value = key
    keyForm.value = {
      name: key.name,
      description: key.description,
      permissions: [...key.permissions],
      rateLimit: key.limit / 24,
      expiration: "90d",
    }
    showCreateModal.value = true
  }

  const regenerateKey = (id: string) => {
    const key = apiKeys.value.find(k => k.id === id)
    if (key) {
      key.key = `sk_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
      newKey.value = key.key
      showKeyModal.value = true
    }
  }

  const revokeKey = (id: string) => {
    const key = apiKeys.value.find(k => k.id === id)
    if (key) {
      key.status = "revoked"
    }
  }

  const closeCreateModal = () => {
    showCreateModal.value = false
    editingKey.value = null
    keyForm.value = {
      name: "",
      description: "",
      permissions: [],
      rateLimit: 1000,
      expiration: "90d",
    }
  }

  const closeKeyModal = () => {
    showKeyModal.value = false
    newKey.value = ""
  }

  const generateNewKey = (): string => {
    return `sk_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
  }

  const calculateExpiryDate = (expiration: ApiKeyExpiration): Date => {
    const days: Record<ApiKeyExpiration, number> = {
      "30d": 2592000000,
      "90d": 7776000000,
      "1y": 31536000000,
      "never": 315360000000, // 10 years as effectively never
    }
    return new Date(Date.now() + days[expiration])
  }

  const saveKey = () => {
    if (editingKey.value) {
      Object.assign(editingKey.value, {
        name: keyForm.value.name,
        description: keyForm.value.description,
        permissions: keyForm.value.permissions,
      })
    } else {
      newKey.value = generateNewKey()
      apiKeys.value.push({
        id: Date.now().toString(),
        name: keyForm.value.name,
        description: keyForm.value.description,
        key: newKey.value,
        permissions: keyForm.value.permissions,
        usage: 0,
        limit: keyForm.value.rateLimit * 24,
        status: "active",
        expiresAt: calculateExpiryDate(keyForm.value.expiration),
        createdAt: new Date(),
      })
      showKeyModal.value = true
    }
    closeCreateModal()
  }

  return {
    showCreateModal,
    showKeyModal,
    editingKey,
    newKey,
    keyForm,
    apiKeys,
    usageData,
    availablePermissions: AVAILABLE_PERMISSIONS,
    activeKeys,
    expiredKeys,
    totalRequests,
    maxRequests,
    formatNumber,
    maskKey,
    formatDate,
    isExpiringSoon,
    copyKey,
    editKey,
    regenerateKey,
    revokeKey,
    closeCreateModal,
    closeKeyModal,
    saveKey,
  }
}
