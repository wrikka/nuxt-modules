export declare function useProductSearchState(): {
    searchQuery: import("vue").Ref<string, string>;
    viewMode: import("vue").Ref<"grid" | "list", "grid" | "list">;
    sortBy: import("vue").Ref<string, string>;
    filters: any;
    activeFilters: import("vue").ComputedRef<Record<string, string>>;
    hasActiveFilters: import("vue").ComputedRef<boolean>;
};
//# sourceMappingURL=ProductSearchState.d.ts.map