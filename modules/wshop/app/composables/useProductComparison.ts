import { ref, computed } from "vue"
import type { Product } from "~~/types"

export interface ComparisonItem {
  productId: string
  product: Product
  selected: boolean
}

export interface ComparisonSpec {
  name: string
  values: Record<string, string | number | boolean>
}

export interface ComparisonResult {
  products: Product[]
  specs: ComparisonSpec[]
  differences: string[]
  bestValue: string
  bestRated: string
  aiRecommendation: string
}

export const useProductComparison = () => {
  const items = ref<ComparisonItem[]>([])
  const maxItems = ref(4)
  const loading = ref(false)

  const addToComparison = (product: Product): boolean => {
    if (items.value.length >= maxItems.value) {
      return false
    }

    if (items.value.some(i => i.productId === product.id)) {
      return false
    }

    items.value.push({
      productId: product.id,
      product,
      selected: true,
    })

    return true
  }

  const removeFromComparison = (productId: string): void => {
    items.value = items.value.filter(i => i.productId !== productId)
  }

  const clearComparison = (): void => {
    items.value = []
  }

  const toggleSelection = (productId: string): void => {
    const item = items.value.find(i => i.productId === productId)
    if (item) {
      item.selected = !item.selected
    }
  }

  const compare = async (): Promise<ComparisonResult> => {
    const selectedProducts = items.value.filter(i => i.selected).map(i => i.product)

    if (selectedProducts.length < 2) {
      throw new Error("Select at least 2 products to compare")
    }

    loading.value = true
    try {
      const result = await $fetch<ComparisonResult>("/api/shop/compare", {
        method: "POST",
        body: {
          productIds: selectedProducts.map(p => p.id),
        },
      })
      return result
    } finally {
      loading.value = false
    }
  }

  const getComparisonSpecs = (products: Product[]): ComparisonSpec[] => {
    const specs: ComparisonSpec[] = []

    // Price
    specs.push({
      name: "Price",
      values: Object.fromEntries(products.map(p => [p.id, p.price])),
    })

    // Rating
    specs.push({
      name: "Rating",
      values: Object.fromEntries(products.map(p => [p.id, (p as Product & { rating?: number }).rating || 0])),
    })

    // Stock
    specs.push({
      name: "Availability",
      values: Object.fromEntries(products.map(p => [p.id, p.inventory.quantity > 0 ? "In Stock" : "Out of Stock"])),
    })

    // Category
    specs.push({
      name: "Category",
      values: Object.fromEntries(products.map(p => [p.id, p.categories[0] || "N/A"])),
    })

    // Tags count
    specs.push({
      name: "Tags",
      values: Object.fromEntries(products.map(p => [p.id, p.tags.length])),
    })

    return specs
  }

  const highlightDifferences = (specs: ComparisonSpec[]): string[] => {
    const differences: string[] = []

    for (const spec of specs) {
      const values = Object.values(spec.values)
      const uniqueValues = [...new Set(values.map(String))]
      if (uniqueValues.length > 1) {
        differences.push(spec.name)
      }
    }

    return differences
  }

  const findBestValue = (products: Product[]): string => {
    return products.reduce((best, current) =>
      current.price < best.price ? current : best,
    products[0]).id
  }

  const findBestRated = (products: Array<Product & { rating?: number }>): string => {
    return products.reduce((best, current) =>
      (current.rating || 0) > (best.rating || 0) ? current : best,
    products[0]).id
  }

  const shareComparison = async (): Promise<string> => {
    const productIds = items.value.filter(i => i.selected).map(i => i.productId)
    const result = await $fetch<{ url: string }>("/api/shop/compare/share", {
      method: "POST",
      body: { productIds },
    })
    return result.url
  }

  const isComparable = (product: Product): boolean => {
    if (items.value.length === 0) return true

    // Check if same category
    const firstProduct = items.value[0]?.product
    if (!firstProduct) return true

    return product.categories.some(c => firstProduct.categories.includes(c))
  }

  const selectedCount = computed(() =>
    items.value.filter(i => i.selected).length,
  )

  const canAddMore = computed(() =>
    items.value.length < maxItems.value,
  )

  const isEmpty = computed(() =>
    items.value.length === 0,
  )

  return {
    items: computed(() => items.value),
    maxItems: computed(() => maxItems.value),
    loading: computed(() => loading.value),
    selectedCount,
    canAddMore,
    isEmpty,
    addToComparison,
    removeFromComparison,
    clearComparison,
    toggleSelection,
    compare,
    getComparisonSpecs,
    highlightDifferences,
    findBestValue,
    findBestRated,
    shareComparison,
    isComparable,
  }
}
