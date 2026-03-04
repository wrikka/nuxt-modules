import { ref, computed } from "vue"

export interface AccountingProvider {
  id: string
  name: string
  logo: string
  enabled: boolean
  apiEndpoint: string
}

export interface SyncConfig {
  autoSync: boolean
  syncInterval: number
  syncOrders: boolean
  syncProducts: boolean
  syncCustomers: boolean
  syncInventory: boolean
  syncInvoices: boolean
}

export interface SyncRecord {
  id: string
  providerId: string
  type: "order" | "product" | "customer" | "inventory" | "invoice"
  entityId: string
  status: "pending" | "synced" | "failed" | "skipped"
  externalId?: string
  errorMessage?: string
  syncedAt?: Date
  createdAt: Date
}

export interface InvoiceData {
  orderId: string
  invoiceNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  issuedAt: Date
  dueAt: Date
}

export const useAccountingSync = () => {
  const providers = ref<AccountingProvider[]>([
    { id: "xero", name: "Xero", logo: "/logos/xero.svg", enabled: false, apiEndpoint: "" },
    { id: "quickbooks", name: "QuickBooks", logo: "/logos/quickbooks.svg", enabled: false, apiEndpoint: "" },
    { id: "freshbooks", name: "FreshBooks", logo: "/logos/freshbooks.svg", enabled: false, apiEndpoint: "" },
    { id: "wave", name: "Wave", logo: "/logos/wave.svg", enabled: false, apiEndpoint: "" },
  ])

  const config = ref<SyncConfig>({
    autoSync: true,
    syncInterval: 3600000, // 1 hour
    syncOrders: true,
    syncProducts: true,
    syncCustomers: true,
    syncInventory: true,
    syncInvoices: true,
  })

  const syncRecords = ref<SyncRecord[]>([])
  const isSyncing = ref(false)
  const lastSync = ref<Date | null>(null)

  const connectProvider = async (providerId: string, credentials: Record<string, string>): Promise<boolean> => {
    const result = await $fetch<{ success: boolean }>(`/api/shop/accounting/${providerId}/connect`, {
      method: "POST",
      body: credentials,
    })

    if (result.success) {
      const provider = providers.value.find(p => p.id === providerId)
      if (provider) {
        provider.enabled = true
      }
    }

    return result.success
  }

  const disconnectProvider = async (providerId: string): Promise<void> => {
    await $fetch(`/api/shop/accounting/${providerId}/disconnect`, {
      method: "POST",
    })

    const provider = providers.value.find(p => p.id === providerId)
    if (provider) {
      provider.enabled = false
    }
  }

  const syncOrders = async (orderIds?: string[]): Promise<SyncRecord[]> => {
    isSyncing.value = true
    try {
      const records = await $fetch<SyncRecord[]>("/api/shop/accounting/sync/orders", {
        method: "POST",
        body: { orderIds },
      })
      syncRecords.value.push(...records)
      lastSync.value = new Date()
      return records
    } finally {
      isSyncing.value = false
    }
  }

  const syncProducts = async (productIds?: string[]): Promise<SyncRecord[]> => {
    isSyncing.value = true
    try {
      const records = await $fetch<SyncRecord[]>("/api/shop/accounting/sync/products", {
        method: "POST",
        body: { productIds },
      })
      syncRecords.value.push(...records)
      return records
    } finally {
      isSyncing.value = false
    }
  }

  const syncCustomers = async (customerIds?: string[]): Promise<SyncRecord[]> => {
    isSyncing.value = true
    try {
      const records = await $fetch<SyncRecord[]>("/api/shop/accounting/sync/customers", {
        method: "POST",
        body: { customerIds },
      })
      syncRecords.value.push(...records)
      return records
    } finally {
      isSyncing.value = false
    }
  }

  const generateInvoice = async (orderId: string): Promise<InvoiceData> => {
    return await $fetch<InvoiceData>("/api/shop/accounting/invoices", {
      method: "POST",
      body: { orderId },
    })
  }

  const syncInvoice = async (invoiceData: InvoiceData): Promise<SyncRecord> => {
    const record = await $fetch<SyncRecord>("/api/shop/accounting/sync/invoice", {
      method: "POST",
      body: invoiceData,
    })
    syncRecords.value.push(record)
    return record
  }

  const fetchSyncStatus = async (): Promise<{
    totalSynced: number
    totalFailed: number
    totalPending: number
    byType: Record<string, { synced: number; failed: number }>
  }> => {
    return await $fetch("/api/shop/accounting/sync/status")
  }

  const retryFailedSync = async (): Promise<SyncRecord[]> => {
    const failed = syncRecords.value.filter(r => r.status === "failed")
    const records = await $fetch<SyncRecord[]>("/api/shop/accounting/sync/retry", {
      method: "POST",
      body: { recordIds: failed.map(f => f.id) },
    })

    // Update records
    records.forEach(record => {
      const index = syncRecords.value.findIndex(r => r.id === record.id)
      if (index !== -1) {
        syncRecords.value[index] = record
      }
    })

    return records
  }

  const getEnabledProviders = computed(() =>
    providers.value.filter(p => p.enabled),
  )

  const pendingSyncCount = computed(() =>
    syncRecords.value.filter(r => r.status === "pending").length,
  )

  const failedSyncCount = computed(() =>
    syncRecords.value.filter(r => r.status === "failed").length,
  )

  const updateConfig = (newConfig: Partial<SyncConfig>) => {
    config.value = { ...config.value, ...newConfig }
  }

  return {
    providers: computed(() => providers.value),
    enabledProviders: getEnabledProviders,
    config: computed(() => config.value),
    syncRecords: computed(() => syncRecords.value),
    isSyncing: computed(() => isSyncing.value),
    lastSync: computed(() => lastSync.value),
    pendingSyncCount,
    failedSyncCount,
    connectProvider,
    disconnectProvider,
    syncOrders,
    syncProducts,
    syncCustomers,
    generateInvoice,
    syncInvoice,
    fetchSyncStatus,
    retryFailedSync,
    updateConfig,
  }
}
