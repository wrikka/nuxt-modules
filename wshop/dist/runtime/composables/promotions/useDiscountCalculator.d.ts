import type { CartItem } from "../../../shared/types/cart.js";
import type { Promotion } from "../../../shared/types/promotion.js";
import type { DiscountApplication } from "./types.js";
export declare function useDiscountCalculator(): {
    calculateDiscount: (promotion: Promotion, cartTotal: number, cartItems: CartItem[]) => DiscountApplication;
    getBestDiscount: (cartTotal: number, cartItems: CartItem[], promotions: Promotion[]) => DiscountApplication;
};
//# sourceMappingURL=useDiscountCalculator.d.ts.map