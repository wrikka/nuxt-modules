import { useAsyncData, useRoute, useRouter } from "#imports"
import type { Product } from "#shared/types"
import { computed, ref, watch } from "vue"

export function useProductEditor() {
	const route = useRoute()
	const router = useRouter()

	const productId = computed(() => route.params.id as string)
	const isNew = computed(() => productId.value === "new")

	const product = ref<Partial<Product>>({
		name: "",
		description: "",
		price: "0.00",
		status: "draft",
		type: "physical",
		options: [],
		variants: [],
	})

	const isSaving = ref(false)

	const { data: fetchedProduct, pending, error, refresh: refreshProduct } = useAsyncData(
		`product-${productId.value}`,
		() => {
			if (isNew.value) return Promise.resolve(null)
			return $fetch<Product>(`/api/products/${productId.value}`)
		},
		{ watch: [productId] },
	)

	watch(fetchedProduct, (newData) => {
		if (isNew.value) {
			product.value = {
				name: "",
				description: "",
				price: "0.00",
				status: "draft",
				type: "physical",
				options: [],
				variants: [],
			}
		} else if (newData) {
			product.value = { ...newData }
		}
	}, { immediate: true })

	const saveProduct = async () => {
		isSaving.value = true
		try {
			if (isNew.value) {
				const newProd = await $fetch<Product>("/api/products", {
					method: "post",
					body: product.value,
				})
				if (newProd?.id) {
					await router.push(`/admin/products/${newProd.id}`)
				}
			} else {
				await $fetch(`/api/products/${productId.value}`, { method: "GET", body: product.value })
				// In a real app, use a toast notification
				alert("Product saved!")
				refreshProduct()
			}
		} catch (error) {
			console.error("Failed to save product:", error)
			alert("Failed to save product.")
		} finally {
			isSaving.value = false
		}
	}

	return {
		product,
		productId,
		isNew,
		isSaving,
		pending,
		saveProduct,
		refreshProduct,
		error,
	}
}
