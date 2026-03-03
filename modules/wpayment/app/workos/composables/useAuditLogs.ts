import { computed, ref } from 'vue'

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName?: string
  userEmail?: string
  action: string
  resource: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  success: boolean
  ipAddress?: string
  userAgent?: string
  organizationId?: string
  organizationName?: string
  metadata?: Record<string, any>
}

export interface AuditFilters {
  startDate: string
  endDate: string
  user: string
  action: string
  severity: 'low' | 'medium' | 'high' | 'critical' | ''
  success: string
}

export function useAuditLogs() {
  const loading = ref(false)
  const logs = ref<AuditLog[]>([])

  const filters = ref<AuditFilters>({
    startDate: '',
    endDate: '',
    user: '',
    action: '',
    severity: '',
    success: '',
  })

  const pagination = ref({
    current: 1,
    total: 0,
    from: 0,
    to: 0,
    hasPrev: false,
    hasNext: false,
    perPage: 20,
  })

  const visiblePages = computed(() => {
    const total = Math.ceil(pagination.value.total / pagination.value.perPage)
    const current = pagination.value.current
    const pages: number[] = []
    const start = Math.max(1, current - 2)
    const end = Math.min(total, current + 2)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  })

  const formatDate = (timestamp: string) => new Date(timestamp).toLocaleDateString()
  const formatTime = (timestamp: string) => new Date(timestamp).toLocaleTimeString()
  const formatDateTime = (timestamp: string) => new Date(timestamp).toLocaleString()
  const formatAction = (action: string) => action.split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(': ')
  const getActionClass = (action: string) => `action-${action.split('.')[0]}`

  const clearFilters = () => {
    filters.value = {
      startDate: '',
      endDate: '',
      user: '',
      action: '',
      severity: '',
      success: '',
    }
    pagination.value.current = 1
  }

  const prevPage = () => {
    if (pagination.value.hasPrev) {
      pagination.value.current--
    }
  }

  const nextPage = () => {
    if (pagination.value.hasNext) {
      pagination.value.current++
    }
  }

  const goToPage = (page: number) => {
    pagination.value.current = page
  }

  return {
    loading,
    logs,
    filters,
    pagination,
    visiblePages,
    formatDate,
    formatTime,
    formatDateTime,
    formatAction,
    getActionClass,
    clearFilters,
    prevPage,
    nextPage,
    goToPage,
  }
}

export function useAuditDetail() {
  const showDetailModal = ref(false)
  const selectedLog = ref<AuditLog | null>(null)

  const showLogDetail = (log: AuditLog) => {
    selectedLog.value = log
    showDetailModal.value = true
  }

  const closeDetailModal = () => {
    showDetailModal.value = false
    selectedLog.value = null
  }

  return {
    showDetailModal,
    selectedLog,
    showLogDetail,
    closeDetailModal,
  }
}
