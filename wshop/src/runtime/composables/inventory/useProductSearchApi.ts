import type { Category, Product, SearchOptions } from "#shared/types"

export function useProductSearchApi() {
	const searchProducts = async (options: SearchOptions) => {
		return await $fetch<{ data: Product[]; total: number }>("/api/products/search", {
			method: "GET",
			query: options,
		})
	}

	const fetchCategories = async () => {
		return await $fetch<Category[]>("/api/categories")
	}

	const getProductSuggestions = async (query: string) => {
		return await $fetch<Product[]>("/api/products/suggestions", {
			method: "GET",
			query: { q: query, limit: 10 },
		})
	}

	const getPopularProducts = async (limit = 10) => {
		return await $fetch<Product[]>("/api/products/popular", {
			method: "GET",
			query: { limit },
		})
	}

	const getRelatedProducts = async (productId: string, limit = 5) => {
		return await $fetch<Product[]>(`/api/products/${productId}/related`, {
			method: "GET",
			query: { limit },
		})
	}

	return {
		searchProducts,
		fetchCategories,
		getProductSuggestions,
		getPopularProducts,
		getRelatedProducts,
	}
}
