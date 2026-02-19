import { type Ref } from "vue";
import type { ProductOption, ProductVariant } from "~~/shared/types";
export declare function useProductVariants(options: Ref<ProductOption[]>, variants: Ref<ProductVariant[]>): {
    displayVariants: import("vue").ComputedRef<{
        id: any;
        options: Record<string, string>;
        price: any;
        stock: any;
        sku: any;
        isNew: boolean;
    }[]>;
};
//# sourceMappingURL=useProductVariants.d.ts.map