export declare function useProductSearchActions(searchQuery: any, filters: any, sortBy: any, emit: any): {
    debouncedSearch: import("lodash-es").DebouncedFunc<() => void>;
    applyFilters: () => void;
    removeFilter: (key: string) => void;
    clearAllFilters: () => void;
    toggleView: (viewMode: any) => void;
};
//# sourceMappingURL=ProductSearchActions.d.ts.map