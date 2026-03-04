import { ref, computed } from "vue"

export interface SalesForecast {
  period: string
  predictedRevenue: number
  predictedOrders: number
  confidenceInterval: { lower: number; upper: number }
  seasonalityFactor: number
}

export interface TrendAnalysis {
  category: string
  trend: "up" | "down" | "stable"
  growthRate: number
  momentum: number
  predictedPeak: Date
}

export interface CustomerPrediction {
  customerId: string
  churnRisk: number
  lifetimeValue: number
  nextPurchaseDate: Date
  recommendedProducts: string[]
  segment: "loyal" | "at_risk" | "churned" | "new"
}

export interface InventoryPrediction {
  productId: string
  predictedDemand: number
  stockOutRisk: number
  overstockRisk: number
  optimalReorderPoint: number
  optimalOrderQuantity: number
}

export interface PriceOptimization {
  productId: string
  currentPrice: number
  suggestedPrice: number
  predictedImpact: {
    revenueChange: number
    volumeChange: number
    profitChange: number
  }
  confidence: number
}

export const usePredictiveAnalytics = () => {
  const salesForecast = ref<SalesForecast[]>([])
  const trends = ref<TrendAnalysis[]>([])
  const customerPredictions = ref<CustomerPrediction[]>([])
  const inventoryPredictions = ref<InventoryPrediction[]>([])
  const priceOptimizations = ref<PriceOptimization[]>([])
  const loading = ref(false)

  const getSalesForecast = async (days = 30): Promise<SalesForecast[]> => {
    loading.value = true
    try {
      const data = await $fetch<SalesForecast[]>("/api/shop/analytics/forecast/sales", {
        params: { days },
      })
      salesForecast.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const getTrendAnalysis = async (): Promise<TrendAnalysis[]> => {
    loading.value = true
    try {
      const data = await $fetch<TrendAnalysis[]>("/api/shop/analytics/trends")
      trends.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const getCustomerPredictions = async (): Promise<CustomerPrediction[]> => {
    loading.value = true
    try {
      const data = await $fetch<CustomerPrediction[]>("/api/shop/analytics/customers/predictions")
      customerPredictions.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const predictCustomerChurn = async (customerId: string): Promise<number> => {
    const result = await $fetch<{ risk: number }>(`/api/shop/analytics/customers/${customerId}/churn`)
    return result.risk
  }

  const getInventoryPredictions = async (): Promise<InventoryPrediction[]> => {
    loading.value = true
    try {
      const data = await $fetch<InventoryPrediction[]>("/api/shop/analytics/inventory/predictions")
      inventoryPredictions.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const predictProductDemand = async (productId: string, days = 30): Promise<{
    daily: number[]
    total: number
    confidence: number
  }> => {
    return await $fetch(`/api/shop/analytics/products/${productId}/demand`, {
      params: { days },
    })
  }

  const getPriceOptimizations = async (): Promise<PriceOptimization[]> => {
    loading.value = true
    try {
      const data = await $fetch<PriceOptimization[]>("/api/shop/analytics/pricing/optimize")
      priceOptimizations.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const optimizePrice = async (productId: string, constraints?: {
    minMargin?: number
    maxIncrease?: number
    competitorPrice?: number
  }): Promise<PriceOptimization> => {
    return await $fetch<PriceOptimization>(`/api/shop/analytics/products/${productId}/optimize-price`, {
      method: "POST",
      body: constraints,
    })
  }

  const getAnomalyDetection = async (metric: "sales" | "traffic" | "conversion", days = 7): Promise<{
    anomalies: Array<{
      date: Date
      value: number
      expected: number
      deviation: number
      severity: "low" | "medium" | "high"
    }>
    insights: string[]
  }> => {
    return await $fetch("/api/shop/analytics/anomalies", {
      params: { metric, days },
    })
  }

  const getProductRecommendations = async (productId: string): Promise<{
    complementary: string[]
    substitutes: string[]
    upsell: string[]
    bundleOpportunities: string[]
  }> => {
    return await $fetch(`/api/shop/analytics/products/${productId}/recommendations`)
  }

  const getDashboardMetrics = async (): Promise<{
    predictedRevenue: number
    predictedOrders: number
    topGrowingCategories: string[]
    atRiskCustomers: number
    stockOutWarnings: number
    pricingOpportunities: number
  }> => {
    return await $fetch("/api/shop/analytics/dashboard")
  }

  const forecastComparison = async (scenarios: Array<{
    name: string
    changes: Record<string, number>
  }>): Promise<Array<{
    scenario: string
    revenue: number
    orders: number
    profit: number
  }>> => {
    return await $fetch("/api/shop/analytics/forecast/comparison", {
      method: "POST",
      body: { scenarios },
    })
  }

  // Computed summaries
  const totalPredictedRevenue = computed(() =>
    salesForecast.value.reduce((sum, f) => sum + f.predictedRevenue, 0),
  )

  const highRiskCustomers = computed(() =>
    customerPredictions.value.filter(c => c.churnRisk > 0.7),
  )

  const stockOutWarnings = computed(() =>
    inventoryPredictions.value.filter(i => i.stockOutRisk > 0.5),
  )

  const growingTrends = computed(() =>
    trends.value.filter(t => t.trend === "up"),
  )

  return {
    salesForecast: computed(() => salesForecast.value),
    trends: computed(() => trends.value),
    customerPredictions: computed(() => customerPredictions.value),
    inventoryPredictions: computed(() => inventoryPredictions.value),
    priceOptimizations: computed(() => priceOptimizations.value),
    loading: computed(() => loading.value),
    totalPredictedRevenue,
    highRiskCustomers,
    stockOutWarnings,
    growingTrends,
    getSalesForecast,
    getTrendAnalysis,
    getCustomerPredictions,
    predictCustomerChurn,
    getInventoryPredictions,
    predictProductDemand,
    getPriceOptimizations,
    optimizePrice,
    getAnomalyDetection,
    getProductRecommendations,
    getDashboardMetrics,
    forecastComparison,
  }
}
