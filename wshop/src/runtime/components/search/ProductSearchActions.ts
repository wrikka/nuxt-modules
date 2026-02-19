import type { ProductFilters } from "#shared/types"
import { debounce } from "lodash-es"

export function useProductSearchActions(
	searchQuery: any,
	filters: any,
	sortBy: any,
	emit: any,
) {
	const debouncedSearch = debounce(() => {
		applyFilters()
	}, 300)

	const applyFilters = () => {
		emit("search", searchQuery.value, filters.value, sortBy.value)
	}

	const removeFilter = (key: string) => {
		if (key === "search") {
			searchQuery.value = ""
		} else {
			filters.value[key as keyof ProductFilters] = ""
		}
		applyFilters()
	}

	const clearAllFilters = () => {
		searchQuery.value = ""
		filters.value = {
			categoryId: "",
			minPrice: "",
			maxPrice: "",
			status: "",
			stockStatus: "",
		}
		applyFilters()
	}

	const toggleView = (viewMode: any) => {
		viewMode.value = viewMode.value === "grid" ? "list" : "grid"
	}

	return {
		debouncedSearch,
		applyFilters,
		removeFilter,
		clearAllFilters,
		toggleView,
	}
}
