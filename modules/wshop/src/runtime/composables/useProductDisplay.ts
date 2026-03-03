// d:/wshop/app/composables/useProductDisplay.ts

import { computed, type Ref, ref, watch } from "vue"
import type { Product, ProductImage, ProductOption, ProductVariant } from "~~/shared/types"

export function useProductDisplay(product: Ref<Product | null>) {
	const selectedOptions = ref<Record<string, string>>({})

	// Initialize selected options when the product loads
	watch(product, (newProduct) => {
		if (newProduct?.options) {
			selectedOptions.value = newProduct.options.reduce(
				(acc: Record<string, string>, opt: ProductOption) => {
					acc[opt.name] = opt.values[0]?.value ?? ""
					return acc
				},
				{} as Record<string, string>,
			)
		}
	}, { immediate: true })

	const selectedVariant = computed<ProductVariant | undefined>(() => {
		if (!product.value?.variants || Object.keys(selectedOptions.value).length === 0) {
			return product.value?.variants?.length === 1 && product.value?.options?.length === 0
				? product.value.variants[0]
				: undefined
		}
		return product.value.variants.find((v: ProductVariant) =>
			JSON.stringify(v.options) === JSON.stringify(selectedOptions.value)
		)
	})

	const displayedPrice = computed(() => selectedVariant.value?.price || product.value?.price || 0)

	const displayedImage = computed(() => {
		const variantImage = product.value?.images?.find((img: ProductImage) =>
			img.id === selectedVariant.value?.imageId
		)
		return variantImage?.src || product.value?.images?.[0]?.src || "/placeholder.svg"
	})

	return {
		selectedOptions,
		selectedVariant,
		displayedPrice,
		displayedImage,
	}
}
