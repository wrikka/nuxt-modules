import type { ProductFilters } from "#shared/types"
import { computed, ref } from "vue"

export function useProductSearchState() {
	const searchQuery = ref("")
	const viewMode = ref<"grid" | "list">("grid")
	const sortBy = ref("name_asc")

	const filters = ref<ProductFilters>({
		categoryId: "",
		minPrice: "",
		maxPrice: "",
		status: "",
		stockStatus: "",
	})

	const activeFilters = computed(() => {
		const result: Record<string, string> = {}

		Object.entries(filters.value).forEach(([key, value]) => {
			if (value) {
				result[key] = value
			}
		})

		if (searchQuery.value) {
			result.search = searchQuery.value
		}

		return result
	})

	const hasActiveFilters = computed(() => {
		return Object.keys(activeFilters.value).length > 0
	})

	return {
		searchQuery,
		viewMode,
		sortBy,
		filters,
		activeFilters,
		hasActiveFilters,
	}
}
