import type { Address, CartItem } from "#shared/types";
import type { Ref } from "vue";
export declare const useTaxCalculator: (cartItems: Ref<CartItem[]>) => {
    taxAmount: any;
    taxBreakdown: any;
    calculateTaxes: (shippingAddress: Address) => Promise<void>;
};
//# sourceMappingURL=useTaxCalculator.d.ts.map