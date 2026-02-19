import { type Ref } from "vue";
import type { Product } from "~~/shared/types";
export declare function useProductDisplay(product: Ref<Product | null>): {
    selectedOptions: Ref<Record<string, string>, Record<string, string>>;
    selectedVariant: import("vue").ComputedRef<any>;
    displayedPrice: import("vue").ComputedRef<any>;
    displayedImage: import("vue").ComputedRef<any>;
};
//# sourceMappingURL=useProductDisplay.d.ts.map