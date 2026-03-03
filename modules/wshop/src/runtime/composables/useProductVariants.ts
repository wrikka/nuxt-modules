// d:/wshop/app/composables/useProductVariants.ts

import { computed, type Ref } from "vue"
import type { ProductOption, ProductVariant } from "~~/shared/types"

// Helper function for deep object comparison
function areOptionsEqual(obj1: Record<string, string>, obj2: Record<string, string>): boolean {
	const keys1 = Object.keys(obj1)
	const keys2 = Object.keys(obj2)
	if (keys1.length !== keys2.length) return false
	for (const key of keys1) {
		if (obj1[key] !== obj2[key]) return false
	}
	return true
}

export function useProductVariants(options: Ref<ProductOption[]>, variants: Ref<ProductVariant[]>) {
	// Generate all possible combinations of options
	const variantCombinations = computed(() => {
		if (!options.value || options.value.length === 0) return []

		const combinations: Record<string, string>[] = []
		const optionArrays = options.value.map((opt) =>
			opt.values.map(val => ({ name: opt.name, value: val.value }))
		)

		function generate(index: number, current: Record<string, string>) {
			if (index === optionArrays.length) {
				combinations.push(current)
				return
			}

			const currentArray = optionArrays[index]
			if (!currentArray) return

			for (const item of currentArray) {
				if (item) { // Add a check for item existence
					generate(index + 1, { ...current, [item.name]: item.value })
				}
			}
		}

		generate(0, {})
		return combinations
	})

	// Sync existing variants with generated combinations
	const displayVariants = computed(() => {
		return variantCombinations.value.map(combo => {
			const existing = variants.value.find(v => v.options && areOptionsEqual(v.options, combo))
			return {
				id: existing?.id || `new-${JSON.stringify(combo)}`,
				options: combo,
				price: existing?.price || "0.00",
				stock: existing?.stock || 0,
				sku: existing?.sku || "",
				isNew: !existing,
			}
		})
	})

	return {
		displayVariants,
	}
}
