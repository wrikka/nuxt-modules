import type { Product } from "#shared/types"
import { readonly } from "vue"
import { useProductApi } from "./useProductApi"

export const useProducts = () => {
	const { $toast } = useNuxtApp()
	const api = useProductApi()

	const {
		data: products,
		pending,
		error,
		refresh,
	} = useAsyncData<Product[]>("products", api.fetchProducts, { server: true })

	const deleteProduct = async (id: string): Promise<void> => {
		try {
			await api.deleteProduct(id)
			await refresh()
			$toast.success("Product deleted successfully")
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete product"
			$toast.error(errorMessage)
			console.error("Failed to delete product:", err)
			throw err
		}
	}

	const formatPrice = (price: string, currency = "THB", locale = "th-TH"): string => {
		return new Intl.NumberFormat(locale, {
			style: "currency",
			currency,
		}).format(parseFloat(price))
	}

	const getProductById = (id: string): Product | undefined => {
		return products.value?.find(product => product.id === id)
	}

	return {
		products: readonly(products),
		pending: readonly(pending),
		error: readonly(error),
		refresh,
		deleteProduct,
		formatPrice,
		getProductById,
	}
}
