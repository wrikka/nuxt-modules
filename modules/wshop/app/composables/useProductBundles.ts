import { ref, computed } from "vue"
import type { Product } from "~~/types"

export interface ProductBundle {
  id: string
  name: string
  description: string
  slug: string
  products: BundleProduct[]
  originalPrice: number
  bundlePrice: number
  discountPercent: number
  discountAmount: number
  image: string
  status: "active" | "inactive" | "draft"
  startDate?: Date
  endDate?: Date
  limitPerCustomer?: number
  totalSold: number
  createdAt: Date
}

export interface BundleProduct {
  productId: string
  product: Product
  quantity: number
  price: number
}

export interface BundleRule {
  id: string
  name: string
  type: "fixed_amount" | "percentage" | "buy_x_get_y" | "tiered"
  conditions: {
    minQuantity?: number
    maxQuantity?: number
    minSpend?: number
    productCategories?: string[]
  }
  discount: {
    type: "fixed" | "percent"
    value: number
  }
  buyX?: number
  getY?: number
}

export const useProductBundles = () => {
  const bundles = ref<ProductBundle[]>([])
  const currentBundle = ref<ProductBundle | null>(null)
  const rules = ref<BundleRule[]>([])
  const loading = ref(false)

  const fetchBundles = async (params?: {
    status?: string
    category?: string
  }): Promise<ProductBundle[]> => {
    loading.value = true
    try {
      const data = await $fetch<ProductBundle[]>("/api/shop/bundles", { params })
      bundles.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const fetchBundle = async (slug: string): Promise<ProductBundle> => {
    loading.value = true
    try {
      const data = await $fetch<ProductBundle>(`/api/shop/bundles/${slug}`)
      currentBundle.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const createBundle = async (bundleData: Omit<ProductBundle, "id" | "createdAt" | "totalSold">): Promise<ProductBundle> => {
    loading.value = true
    try {
      const data = await $fetch<ProductBundle>("/api/shop/bundles", {
        method: "POST",
        body: bundleData,
      })
      bundles.value.push(data)
      return data
    } finally {
      loading.value = false
    }
  }

  const updateBundle = async (id: string, updates: Partial<ProductBundle>): Promise<ProductBundle> => {
    const data = await $fetch<ProductBundle>(`/api/shop/bundles/${id}`, {
      method: "PUT",
      body: updates,
    })

    const index = bundles.value.findIndex(b => b.id === id)
    if (index !== -1) {
      bundles.value[index] = { ...bundles.value[index], ...data }
    }

    if (currentBundle.value?.id === id) {
      currentBundle.value = { ...currentBundle.value, ...data }
    }

    return data
  }

  const deleteBundle = async (id: string): Promise<void> => {
    await $fetch(`/api/shop/bundles/${id}`, {
      method: "DELETE",
    })

    bundles.value = bundles.value.filter(b => b.id !== id)
  }

  const addToBundle = async (bundleId: string, productId: string, quantity = 1): Promise<void> => {
    await $fetch(`/api/shop/bundles/${bundleId}/products`, {
      method: "POST",
      body: { productId, quantity },
    })
  }

  const removeFromBundle = async (bundleId: string, productId: string): Promise<void> => {
    await $fetch(`/api/shop/bundles/${bundleId}/products/${productId}`, {
      method: "DELETE",
    })
  }

  const calculateBundlePrice = (products: BundleProduct[], discountRule?: BundleRule): number => {
    const originalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

    if (!discountRule) {
      return originalPrice
    }

    switch (discountRule.type) {
      case "fixed_amount":
        return Math.max(0, originalPrice - discountRule.discount.value)
      case "percentage":
        return originalPrice * (1 - discountRule.discount.value / 100)
      case "buy_x_get_y": {
        // Calculate based on buy X get Y free
        return originalPrice // Simplified
      }
      default:
        return originalPrice
    }
  }

  const applyBundleToCart = async (bundleId: string, cartId: string): Promise<{
    added: boolean
    discountApplied: number
  }> => {
    return await $fetch("/api/shop/bundles/apply", {
      method: "POST",
      body: { bundleId, cartId },
    })
  }

  const getBundleSavings = (bundle: ProductBundle): number => {
    return bundle.originalPrice - bundle.bundlePrice
  }

  const getSavingsPercent = (bundle: ProductBundle): number => {
    return Math.round((getBundleSavings(bundle) / bundle.originalPrice) * 100)
  }

  const activeBundles = computed(() =>
    bundles.value.filter(b => {
      if (b.status !== "active") return false
      if (b.startDate && new Date() < new Date(b.startDate)) return false
      if (b.endDate && new Date() > new Date(b.endDate)) return false
      return true
    }),
  )

  const featuredBundles = computed(() =>
    activeBundles.value
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 6),
  )

  return {
    bundles: computed(() => bundles.value),
    currentBundle: computed(() => currentBundle.value),
    rules: computed(() => rules.value),
    loading: computed(() => loading.value),
    activeBundles,
    featuredBundles,
    fetchBundles,
    fetchBundle,
    createBundle,
    updateBundle,
    deleteBundle,
    addToBundle,
    removeFromBundle,
    calculateBundlePrice,
    applyBundleToCart,
    getBundleSavings,
    getSavingsPercent,
  }
}
