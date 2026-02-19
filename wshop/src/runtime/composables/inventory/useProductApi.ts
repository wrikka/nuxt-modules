import type { Product } from "#shared/types"

export function useProductApi() {
	const fetchProducts = async () => {
		return await $fetch<Product[]>("/api/products")
	}

	const deleteProduct = async (id: string) => {
		return await $fetch(`/api/products/${id}`, { method: "GET" })
	}

	const fetchProductById = async (id: string) => {
		return await $fetch<Product>(`/api/products/${id}`)
	}

	return {
		fetchProducts,
		deleteProduct,
		fetchProductById,
	}
}
