import type { Category, Product, ProductFilters, SearchOptions } from "#shared/types"
import { onMounted, ref } from "vue"
import { useProductSearchApi } from "./useProductSearchApi"

export function useProductSearch() {
	const api = useProductSearchApi()

	const products = ref<Product[]>([])
	const categories = ref<Category[]>([])
	const loading = ref(false)
	const error = ref<string | null>(null)
	const total = ref(0)
	const currentPage = ref(1)
	const totalPages = ref(0)
	const hasMore = ref(false)

	const searchQuery = ref("")
	const searchFilters = ref<ProductFilters>({})
	const searchSortBy = ref("name_asc")

	const searchProducts = async (options: SearchOptions = {}) => {
		loading.value = true
		error.value = null
		try {
			const { query, filters, sortBy, page = 1, limit = 20 } = options
			const response = await api.searchProducts({ query, filters, sortBy, page, limit })
			products.value = response.data
			total.value = response.total
			totalPages.value = Math.ceil(response.total / limit)
			hasMore.value = page < totalPages.value
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to search products"
		} finally {
			loading.value = false
		}
	}

	const loadCategories = async () => {
		try {
			categories.value = await api.fetchCategories()
		} catch (err) {
			console.error("Failed to load categories:", err)
		}
	}

	onMounted(loadCategories)

	return {
		products,
		categories,
		loading,
		error,
		total,
		currentPage,
		totalPages,
		hasMore,
		searchQuery,
		searchFilters,
		searchSortBy,
		searchProducts,
		loadCategories,
		getProductSuggestions: api.getProductSuggestions,
		getPopularProducts: api.getPopularProducts,
		getRelatedProducts: api.getRelatedProducts,
	}
}
