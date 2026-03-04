import { ref, computed } from "vue"
import type { Product } from "~~/types"

export interface BulkPriceRule {
  type: "fixed_amount" | "percentage" | "new_price"
  value: number
  applyTo: "all" | "selected" | "filtered"
}

export interface BulkPriceChange {
  productId: string
  oldPrice: number
  newPrice: number
  change: number
  changePercent: number
}

export interface BulkPricePreview {
  changes: BulkPriceChange[]
  totalProducts: number
  totalChange: number
  averageChange: number
  affectedRevenue: number
}

export const useBulkPriceEditor = () => {
  const selectedProducts = ref<string[]>([])
  const preview = ref<BulkPricePreview | null>(null)
  const loading = ref(false)
  const history = ref<BulkPriceChange[][]>([])

  const selectProduct = (productId: string): void => {
    if (!selectedProducts.value.includes(productId)) {
      selectedProducts.value.push(productId)
    }
  }

  const deselectProduct = (productId: string): void => {
    selectedProducts.value = selectedProducts.value.filter(id => id !== productId)
  }

  const selectAll = (productIds: string[]): void => {
    selectedProducts.value = [...new Set([...selectedProducts.value, ...productIds])]
  }

  const clearSelection = (): void => {
    selectedProducts.value = []
  }

  const previewPriceChange = async (rule: BulkPriceRule): Promise<BulkPricePreview> => {
    loading.value = true
    try {
      const result = await $fetch<BulkPricePreview>("/api/shop/bulk-prices/preview", {
        method: "POST",
        body: {
          rule,
          productIds: selectedProducts.value,
        },
      })
      preview.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  const applyPriceChange = async (rule: BulkPriceRule, confirm = false): Promise<BulkPriceChange[]> => {
    if (!confirm) {
      throw new Error("Must confirm to apply changes")
    }

    loading.value = true
    try {
      const changes = await $fetch<BulkPriceChange[]>("/api/shop/bulk-prices/apply", {
        method: "POST",
        body: {
          rule,
          productIds: selectedProducts.value,
        },
      })

      // Save to history
      history.value.unshift(changes)
      if (history.value.length > 10) {
        history.value.pop()
      }

      return changes
    } finally {
      loading.value = false
    }
  }

  const roundPrices = async (precision: "0.01" | "0.05" | "0.10" | "0.99" = "0.01"): Promise<BulkPriceChange[]> => {
    loading.value = true
    try {
      const changes = await $fetch<BulkPriceChange[]>("/api/shop/bulk-prices/round", {
        method: "POST",
        body: {
          productIds: selectedProducts.value,
          precision,
        },
      })
      return changes
    } finally {
      loading.value = false
    }
  }

  const adjustForCompetitor = async (
    competitorPrices: Record<string, number>,
    strategy: "match" | "beat_by_percent" | "beat_by_amount",
    value: number,
  ): Promise<BulkPriceChange[]> => {
    loading.value = true
    try {
      const changes = await $fetch<BulkPriceChange[]>("/api/shop/bulk-prices/competitor", {
        method: "POST",
        body: {
          productIds: selectedProducts.value,
          competitorPrices,
          strategy,
          value,
        },
      })
      return changes
    } finally {
      loading.value = false
    }
  }

  const schedulePriceChange = async (
    rule: BulkPriceRule,
    scheduledAt: Date,
    revertAt?: Date,
  ): Promise<{ jobId: string }> => {
    return await $fetch("/api/shop/bulk-prices/schedule", {
      method: "POST",
      body: {
        rule,
        productIds: selectedProducts.value,
        scheduledAt: scheduledAt.toISOString(),
        revertAt: revertAt?.toISOString(),
      },
    })
  }

  const cancelScheduledChange = async (jobId: string): Promise<void> => {
    await $fetch(`/api/shop/bulk-prices/schedule/${jobId}`, {
      method: "DELETE",
    })
  }

  const revertLastChange = async (): Promise<BulkPriceChange[]> => {
    if (history.value.length === 0) {
      throw new Error("No changes to revert")
    }

    const lastChange = history.value[0]
    const revertRule: BulkPriceRule = {
      type: "fixed_amount",
      value: 0,
      applyTo: "selected",
    }

    // Revert by setting prices back to old values
    return await $fetch<BulkPriceChange[]>("/api/shop/bulk-prices/revert", {
      method: "POST",
      body: {
        changes: lastChange,
      },
    })
  }

  const exportPriceReport = async (): Promise<string> => {
    const result = await $fetch<{ downloadUrl: string }>("/api/shop/bulk-prices/export", {
      method: "POST",
      body: {
        productIds: selectedProducts.value,
      },
    })
    return result.downloadUrl
  }

  const selectedCount = computed(() => selectedProducts.value.length)

  const hasPreview = computed(() => preview.value !== null)

  const canRevert = computed(() => history.value.length > 0)

  return {
    selectedProducts: computed(() => selectedProducts.value),
    preview: computed(() => preview.value),
    loading: computed(() => loading.value),
    history: computed(() => history.value),
    selectedCount,
    hasPreview,
    canRevert,
    selectProduct,
    deselectProduct,
    selectAll,
    clearSelection,
    previewPriceChange,
    applyPriceChange,
    roundPrices,
    adjustForCompetitor,
    schedulePriceChange,
    cancelScheduledChange,
    revertLastChange,
    exportPriceReport,
  }
}
