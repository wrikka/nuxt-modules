import { ref, computed } from "vue"
import type { Connection, TrendDay, TestResult, NewConnection } from "../types"

const PROVIDER_ICONS: Record<string, string> = {
  Okta: "🔵",
  "Azure AD": "🟦",
  "Google Workspace": "🟢",
  OneLogin: "🟠",
  PingFederate: "🟣",
}

const STATUS_ICONS = { healthy: "✓", degraded: "⚠", down: "✕" }
const CHECK_ICONS = { healthy: "✓", warning: "⚠", error: "✕" }

export function useSSOHealth() {
  const connections = ref<Connection[]>([
    {
      id: "1",
      name: "Corporate SSO",
      provider: "Okta",
      domain: "acme.com",
      status: "healthy",
      uptime: 99.9,
      responseTime: 145,
      successRate: 99.8,
      lastCheck: new Date(),
      checks: [
        { name: "DNS Resolution", status: "healthy", value: "OK" },
        { name: "Certificate", status: "healthy", value: "Valid (30 days)" },
        { name: "Metadata", status: "healthy", value: "Valid" },
        { name: "Authentication", status: "healthy", value: "OK" },
      ],
      alerts: [],
    },
    {
      id: "2",
      name: "Partner Portal",
      provider: "Azure AD",
      domain: "partners.acme.com",
      status: "degraded",
      uptime: 98.5,
      responseTime: 320,
      successRate: 96.2,
      lastCheck: new Date(Date.now() - 300000),
      checks: [
        { name: "DNS Resolution", status: "healthy", value: "OK" },
        { name: "Certificate", status: "warning", value: "Expiring soon (7 days)" },
        { name: "Metadata", status: "healthy", value: "Valid" },
        { name: "Authentication", status: "warning", value: "Slow response" },
      ],
      alerts: [
        { id: "1", severity: "warning", message: "Certificate expiring in 7 days", timestamp: new Date() },
      ],
    },
    {
      id: "3",
      name: "Contractor Access",
      provider: "Google Workspace",
      domain: "contractors.acme.com",
      status: "down",
      uptime: 85.0,
      responseTime: 0,
      successRate: 0,
      lastCheck: new Date(Date.now() - 3600000),
      checks: [
        { name: "DNS Resolution", status: "error", value: "Failed" },
        { name: "Certificate", status: "error", value: "N/A" },
        { name: "Metadata", status: "error", value: "N/A" },
        { name: "Authentication", status: "error", value: "Failed" },
      ],
      alerts: [
        { id: "1", severity: "error", message: "Connection unreachable", timestamp: new Date() },
      ],
    },
  ])

  const healthTrend = ref<TrendDay[]>([
    { day: "Mon", health: 99 },
    { day: "Tue", health: 98 },
    { day: "Wed", health: 100 },
    { day: "Thu", health: 97 },
    { day: "Fri", health: 85 },
    { day: "Sat", health: 92 },
    { day: "Sun", health: 95 },
  ])

  const overallStatus = computed(() => {
    if (connections.value.some(c => c.status === "down")) return "down"
    if (connections.value.some(c => c.status === "degraded")) return "degraded"
    return "healthy"
  })

  const overallStatusLabel = computed(() => {
    const labels = {
      healthy: "All Systems Operational",
      degraded: "Some Systems Degraded",
      down: "System Outage Detected",
    }
    return labels[overallStatus.value]
  })

  return {
    connections,
    healthTrend,
    overallStatus,
    overallStatusLabel,
  }
}

export function useSSOFormatters() {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const getStatusIcon = (status: string) => STATUS_ICONS[status as keyof typeof STATUS_ICONS] || "?"
  const getProviderIcon = (provider: string) => PROVIDER_ICONS[provider] || "⚪"
  const getCheckIcon = (status: string) => CHECK_ICONS[status as keyof typeof CHECK_ICONS] || "?"
  const getAlertIcon = (severity: string) => severity === "error" ? "🚨" : "⚠️"

  const getHealthClass = (health: number) => {
    if (health >= 95) return "excellent"
    if (health >= 80) return "good"
    if (health >= 60) return "warning"
    return "critical"
  }

  return {
    formatTime,
    getStatusIcon,
    getProviderIcon,
    getCheckIcon,
    getAlertIcon,
    getHealthClass,
  }
}

export function useSSOTesting() {
  const showTestModal = ref(false)
  const testInProgress = ref(false)
  const testResult = ref<TestResult | null>(null)

  const testConnection = async (connection: Connection) => {
    showTestModal.value = true
    testInProgress.value = true

    setTimeout(() => {
      testInProgress.value = false
      testResult.value = {
        success: connection.status !== "down",
        steps: [
          { name: "DNS Resolution", success: true, duration: 45 },
          { name: "Certificate Validation", success: true, duration: 120 },
          { name: "Metadata Fetch", success: true, duration: 85 },
          { name: "Authentication Test", success: connection.status !== "down", duration: 200 },
        ],
      }
    }, 2000)
  }

  const closeTestModal = () => {
    showTestModal.value = false
    testResult.value = null
  }

  return {
    showTestModal,
    testInProgress,
    testResult,
    testConnection,
    closeTestModal,
  }
}

export function useSSOConnectionForm() {
  const showAddConnection = ref(false)

  const newConnection = ref<NewConnection>({
    name: "",
    provider: "Okta",
    domain: "",
    clientId: "",
    clientSecret: "",
  })

  const openAddModal = () => {
    showAddConnection.value = true
  }

  const closeAddModal = () => {
    showAddConnection.value = false
  }

  const saveConnection = () => {
    showAddConnection.value = false
  }

  return {
    showAddConnection,
    newConnection,
    openAddModal,
    closeAddModal,
    saveConnection,
  }
}
