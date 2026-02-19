import type { SearchOptions } from "#shared/types";
export declare function useProductSearchApi(): {
    searchProducts: (options: SearchOptions) => Promise<any>;
    fetchCategories: () => Promise<any>;
    getProductSuggestions: (query: string) => Promise<any>;
    getPopularProducts: (limit?: number) => Promise<any>;
    getRelatedProducts: (productId: string, limit?: number) => Promise<any>;
};
//# sourceMappingURL=useProductSearchApi.d.ts.map