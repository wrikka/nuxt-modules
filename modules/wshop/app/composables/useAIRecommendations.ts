import { ref, computed } from "vue"
import { useFetch } from "#imports"
import type { Product } from "~~/types"

export interface RecommendationContext {
  productId?: string
  category?: string
  tags?: string[]
  customerId?: string
  browsingHistory?: string[]
  cartItems?: string[]
}

export interface RecommendationResult {
  products: Product[]
  reasoning: string[]
  confidence: number
}

export const useAIRecommendations = () => {
  const recommendations = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const getPersonalizedRecommendations = async (
    context: RecommendationContext,
    limit = 10,
  ): Promise<RecommendationResult> => {
    loading.value = true
    error.value = null

    try {
      const result = await $fetch<RecommendationResult>("/api/shop/ai/recommendations", {
        method: "POST",
        body: {
          context,
          limit,
          strategy: "collaborative_filtering",
        },
      })

      recommendations.value = result.products
      return result
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const getSimilarProducts = async (
    productId: string,
    limit = 8,
  ): Promise<Product[]> => {
    loading.value = true
    error.value = null

    try {
      const products = await $fetch<Product[]>("/api/shop/ai/similar-products", {
        params: { productId, limit },
      })

      recommendations.value = products
      return products
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const getFrequentlyBoughtTogether = async (
    productIds: string[],
    limit = 5,
  ): Promise<Product[]> => {
    loading.value = true
    error.value = null

    try {
      const products = await $fetch<Product[]>("/api/shop/ai/frequently-bought-together", {
        method: "POST",
        body: { productIds, limit },
      })

      recommendations.value = products
      return products
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTrendingProducts = async (
    category?: string,
    limit = 10,
  ): Promise<Product[]> => {
    loading.value = true
    error.value = null

    try {
      const products = await $fetch<Product[]>("/api/shop/ai/trending", {
        params: { category, limit },
      })

      recommendations.value = products
      return products
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCompleteTheLook = async (
    productId: string,
    limit = 4,
  ): Promise<Product[]> => {
    loading.value = true
    error.value = null

    try {
      const products = await $fetch<Product[]>("/api/shop/ai/complete-the-look", {
        params: { productId, limit },
      })

      recommendations.value = products
      return products
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const trackProductView = async (productId: string, customerId?: string) => {
    try {
      await $fetch("/api/shop/ai/track-view", {
        method: "POST",
        body: { productId, customerId, timestamp: new Date().toISOString() },
      })
    } catch {
      // Silently fail tracking
    }
  }

  return {
    recommendations: computed(() => recommendations.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    getPersonalizedRecommendations,
    getSimilarProducts,
    getFrequentlyBoughtTogether,
    getTrendingProducts,
    getCompleteTheLook,
    trackProductView,
  }
}
