import { debounce } from "lodash-es";
export function useProductSearchActions(searchQuery, filters, sortBy, emit) {
  const debouncedSearch = debounce(() => {
    applyFilters();
  }, 300);
  const applyFilters = () => {
    emit("search", searchQuery.value, filters.value, sortBy.value);
  };
  const removeFilter = (key) => {
    if (key === "search") {
      searchQuery.value = "";
    } else {
      filters.value[key] = "";
    }
    applyFilters();
  };
  const clearAllFilters = () => {
    searchQuery.value = "";
    filters.value = {
      categoryId: "",
      minPrice: "",
      maxPrice: "",
      status: "",
      stockStatus: ""
    };
    applyFilters();
  };
  const toggleView = (viewMode) => {
    viewMode.value = viewMode.value === "grid" ? "list" : "grid";
  };
  return {
    debouncedSearch,
    applyFilters,
    removeFilter,
    clearAllFilters,
    toggleView
  };
}
