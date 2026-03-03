// useSecurityDashboard Composable
// Core logic for the Security Dashboard

import { ref, computed } from 'vue'
import type {
  Incident,
  ThreatRegion,
  SecurityStats,
  IncidentFilter,
  TimeRange,
} from '../types/security'

export function useSecurityDashboard() {
  const timeRange = ref<TimeRange>("7d")
  const activeFilter = ref("all")
  const searchQuery = ref("")
  const showDetailModal = ref(false)
  const selectedIncident = ref<Incident | null>(null)

  const stats = ref<SecurityStats>({
    criticalIncidents: 3,
    warningIncidents: 12,
    blockedAttempts: 156,
    resolvedIncidents: 45,
  })

  const incidents = ref<Incident[]>([
    {
      id: "1",
      type: "Brute Force",
      severity: "critical",
      status: "pending",
      title: "Multiple failed login attempts detected",
      description: "User attempted to login 15 times within 5 minutes from different IPs",
      user: "john.doe@example.com",
      userId: "user1",
      ip: "203.0.113.1",
      location: "Singapore",
      timestamp: new Date(Date.now() - 3600000),
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      requestPath: "/api/auth/login",
    },
    {
      id: "2",
      type: "Suspicious Login",
      severity: "warning",
      status: "investigating",
      title: "Login from unusual location",
      description: "User logged in from a location they don't typically access",
      user: "jane.smith@example.com",
      userId: "user2",
      ip: "198.51.100.1",
      location: "Russia",
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: "3",
      type: "Account Takeover",
      severity: "critical",
      status: "pending",
      title: "Possible account compromise",
      description: "Password changed followed by immediate login from new device",
      user: "admin@company.com",
      userId: "user3",
      ip: "192.0.2.1",
      location: "China",
      timestamp: new Date(Date.now() - 10800000),
    },
    {
      id: "4",
      type: "API Abuse",
      severity: "warning",
      status: "resolved",
      title: "Rate limit exceeded",
      description: "User exceeded API rate limit multiple times",
      user: "developer@example.com",
      userId: "user4",
      ip: "203.0.113.50",
      location: "United States",
      timestamp: new Date(Date.now() - 86400000),
    },
  ])

  const threatRegions = ref<ThreatRegion[]>([
    { name: "Russia", count: 45, percentage: 85 },
    { name: "China", count: 38, percentage: 72 },
    { name: "Singapore", count: 25, percentage: 47 },
    { name: "Brazil", count: 18, percentage: 34 },
    { name: "India", count: 12, percentage: 23 },
  ])

  const filters = computed<IncidentFilter[]>(() => [
    { label: "All", value: "all", count: incidents.value.length },
    { label: "Critical", value: "critical", count: incidents.value.filter(i => i.severity === "critical").length },
    { label: "Warning", value: "warning", count: incidents.value.filter(i => i.severity === "warning").length },
    { label: "Pending", value: "pending", count: incidents.value.filter(i => i.status === "pending").length },
  ])

  const filteredIncidents = computed(() => {
    let result = incidents.value

    if (activeFilter.value !== "all") {
      if (activeFilter.value === "pending") {
        result = result.filter(i => i.status === "pending")
      } else {
        result = result.filter(i => i.severity === activeFilter.value)
      }
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(i =>
        i.title.toLowerCase().includes(query) ||
        i.description.toLowerCase().includes(query) ||
        i.user.toLowerCase().includes(query)
      )
    }

    return result
  })

  const formatTime = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const viewDetails = (incident: Incident) => {
    selectedIncident.value = incident
    showDetailModal.value = true
  }

  const closeDetails = () => {
    showDetailModal.value = false
    selectedIncident.value = null
  }

  const resolveIncident = (id: string) => {
    const incident = incidents.value.find(i => i.id === id)
    if (incident) {
      incident.status = "resolved"
      stats.value.resolvedIncidents++
    }
  }

  const blockUser = (userId: string) => {
    incidents.value = incidents.value.filter(i => i.userId !== userId)
  }

  const exportReport = () => {
    const data = JSON.stringify(incidents.value, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "security-report.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    timeRange,
    activeFilter,
    searchQuery,
    showDetailModal,
    selectedIncident,
    stats,
    incidents,
    threatRegions,
    filters,
    filteredIncidents,
    formatTime,
    viewDetails,
    closeDetails,
    resolveIncident,
    blockUser,
    exportReport,
  }
}
