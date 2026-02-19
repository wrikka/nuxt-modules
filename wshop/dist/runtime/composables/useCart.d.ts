import { computed } from "#imports";
import type { Product, ProductVariant } from "~~/shared/types";
export declare const useCart: () => {
    cart: any;
    pending: any;
    error: any;
    refresh: any;
    addToCart: (product: Product, variant: ProductVariant, quantity?: number) => Promise<any>;
    updateQuantity: (cartItemId: string, quantity: number) => Promise<any>;
    removeFromCart: (cartItemId: string) => Promise<any>;
    clearCart: () => Promise<any>;
    applyDiscount: (code: string) => Promise<{
        success: boolean;
        message: string;
    }>;
    removeDiscount: () => Promise<{
        success: boolean;
        message: string;
    }>;
    applyGiftCard: (code: string) => Promise<{
        success: boolean;
        message: string;
    }>;
    removeGiftCard: () => Promise<{
        success: boolean;
        message: string;
    }>;
    calculateTaxes: (shippingAddress: computed) => Promise<void>;
    itemCount: any;
    subtotal: any;
    discountAmount: any;
    giftCardAmount: any;
    shipping: any;
    taxAmount: any;
    taxBreakdown: any;
    total: any;
};
//# sourceMappingURL=useCart.d.ts.map