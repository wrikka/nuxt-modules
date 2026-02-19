import type { Product } from "#shared/types";
export declare const useProducts: () => {
    products: any;
    pending: any;
    error: any;
    refresh: any;
    deleteProduct: (id: string) => Promise<void>;
    formatPrice: (price: string, currency?: string, locale?: string) => string;
    getProductById: (id: string) => Product | undefined;
};
//# sourceMappingURL=useProducts.d.ts.map