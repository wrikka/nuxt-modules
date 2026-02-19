import type { SearchOptions } from "#shared/types";
export declare function useProductSearch(): {
    products: import("vue").Ref<any, any>;
    categories: import("vue").Ref<any, any>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    total: import("vue").Ref<number, number>;
    currentPage: import("vue").Ref<number, number>;
    totalPages: import("vue").Ref<number, number>;
    hasMore: import("vue").Ref<boolean, boolean>;
    searchQuery: import("vue").Ref<string, string>;
    searchFilters: any;
    searchSortBy: import("vue").Ref<string, string>;
    searchProducts: (options?: SearchOptions) => Promise<void>;
    loadCategories: () => Promise<void>;
    getProductSuggestions: (query: string) => Promise<any>;
    getPopularProducts: (limit?: number) => Promise<any>;
    getRelatedProducts: (productId: string, limit?: number) => Promise<any>;
};
//# sourceMappingURL=useProductSearch.d.ts.map