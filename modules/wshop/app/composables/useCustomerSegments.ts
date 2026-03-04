import { ref, computed } from "vue"

export interface CustomerSegment {
  id: string
  name: string
  description: string
  criteria: SegmentCriteria
  customerCount: number
  totalRevenue: number
  averageOrderValue: number
  createdAt: Date
  updatedAt: Date
  autoAssign: boolean
}

export interface SegmentCriteria {
  totalSpend?: { min?: number; max?: number }
  orderCount?: { min?: number; max?: number }
  lastPurchase?: { withinDays?: number; beforeDays?: number }
  productsPurchased?: string[]
  categoriesPurchased?: string[]
  registrationDate?: { from?: Date; to?: Date }
  emailEngagement?: { opened?: boolean; clicked?: boolean }
  demographics?: {
    ageRange?: { min: number; max: number }
    location?: string[]
    gender?: string[]
  }
  customAttributes?: Record<string, string | number | boolean>
}

export interface SegmentMember {
  customerId: string
  segmentId: string
  joinedAt: Date
  score: number
}

export const useCustomerSegments = () => {
  const segments = ref<CustomerSegment[]>([])
  const currentSegment = ref<CustomerSegment | null>(null)
  const members = ref<SegmentMember[]>([])
  const loading = ref(false)

  const fetchSegments = async (): Promise<CustomerSegment[]> => {
    loading.value = true
    try {
      const data = await $fetch<CustomerSegment[]>("/api/shop/segments")
      segments.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const fetchSegment = async (id: string): Promise<CustomerSegment> => {
    loading.value = true
    try {
      const data = await $fetch<CustomerSegment>(`/api/shop/segments/${id}`)
      currentSegment.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const createSegment = async (
    name: string,
    description: string,
    criteria: SegmentCriteria,
    autoAssign = false,
  ): Promise<CustomerSegment> => {
    loading.value = true
    try {
      const segment = await $fetch<CustomerSegment>("/api/shop/segments", {
        method: "POST",
        body: { name, description, criteria, autoAssign },
      })
      segments.value.push(segment)
      return segment
    } finally {
      loading.value = false
    }
  }

  const updateSegment = async (id: string, updates: Partial<CustomerSegment>): Promise<CustomerSegment> => {
    const segment = await $fetch<CustomerSegment>(`/api/shop/segments/${id}`, {
      method: "PUT",
      body: updates,
    })

    const index = segments.value.findIndex(s => s.id === id)
    if (index !== -1) {
      segments.value[index] = { ...segments.value[index], ...segment }
    }

    if (currentSegment.value?.id === id) {
      currentSegment.value = { ...currentSegment.value, ...segment }
    }

    return segment
  }

  const deleteSegment = async (id: string): Promise<void> => {
    await $fetch(`/api/shop/segments/${id}`, {
      method: "DELETE",
    })

    segments.value = segments.value.filter(s => s.id !== id)
  }

  const fetchSegmentMembers = async (segmentId: string): Promise<SegmentMember[]> => {
    const data = await $fetch<SegmentMember[]>(`/api/shop/segments/${segmentId}/members`)
    members.value = data
    return data
  }

  const addCustomerToSegment = async (segmentId: string, customerId: string): Promise<void> => {
    await $fetch(`/api/shop/segments/${segmentId}/members`, {
      method: "POST",
      body: { customerId },
    })
  }

  const removeCustomerFromSegment = async (segmentId: string, customerId: string): Promise<void> => {
    await $fetch(`/api/shop/segments/${segmentId}/members/${customerId}`, {
      method: "DELETE",
    })
  }

  const previewSegment = async (criteria: SegmentCriteria): Promise<{
    count: number
    sample: Array<{ customerId: string; email: string; name: string }>
  }> => {
    return await $fetch("/api/shop/segments/preview", {
      method: "POST",
      body: { criteria },
    })
  }

  const runSegmentation = async (): Promise<{
    processed: number
    assigned: number
    removed: number
  }> => {
    return await $fetch("/api/shop/segments/run", {
      method: "POST",
    })
  }

  const getSegmentStats = async (segmentId: string): Promise<{
    growth: number
    churn: number
    averageLifetime: number
    topProducts: string[]
    preferredCategories: string[]
    emailOpenRate: number
    conversionRate: number
  }> => {
    return await $fetch(`/api/shop/segments/${segmentId}/stats`)
  }

  const getCustomerSegments = async (customerId: string): Promise<CustomerSegment[]> => {
    return await $fetch<CustomerSegment[]>(`/api/shop/customers/${customerId}/segments`)
  }

  const segmentCustomers = async (customerIds: string[], segmentId: string): Promise<{
    assigned: number
    failed: number
  }> => {
    return await $fetch("/api/shop/segments/bulk-assign", {
      method: "POST",
      body: { customerIds, segmentId },
    })
  }

  // Predefined segments
  const predefinedSegments = [
    { name: "VIP Customers", description: "High value customers", criteria: { totalSpend: { min: 1000 } } },
    { name: "New Customers", description: "Recently registered", criteria: { registrationDate: { withinDays: 30 } } },
    { name: "At Risk", description: "Haven't purchased recently", criteria: { lastPurchase: { beforeDays: 90 } } },
    { name: "Champions", description: "Frequent high-value buyers", criteria: { totalSpend: { min: 500 }, orderCount: { min: 5 } } },
    { name: "Loyal", description: "Regular repeat customers", criteria: { orderCount: { min: 3 } } },
  ]

  const highValueSegments = computed(() =>
    segments.value.filter(s => s.averageOrderValue > 100),
  )

  const atRiskSegments = computed(() =>
    segments.value.filter(s => s.name.toLowerCase().includes("risk")),
  )

  const segmentCount = computed(() => segments.value.length)

  const totalSegmentedCustomers = computed(() =>
    segments.value.reduce((sum, s) => sum + s.customerCount, 0),
  )

  return {
    segments: computed(() => segments.value),
    currentSegment: computed(() => currentSegment.value),
    members: computed(() => members.value),
    loading: computed(() => loading.value),
    predefinedSegments,
    highValueSegments,
    atRiskSegments,
    segmentCount,
    totalSegmentedCustomers,
    fetchSegments,
    fetchSegment,
    createSegment,
    updateSegment,
    deleteSegment,
    fetchSegmentMembers,
    addCustomerToSegment,
    removeCustomerFromSegment,
    previewSegment,
    runSegmentation,
    getSegmentStats,
    getCustomerSegments,
    segmentCustomers,
  }
}
