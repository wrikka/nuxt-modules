import type { Product, ProductVariant } from "#shared/types";
export declare function usePosCart(products: any): {
    cart: any;
    subtotal: any;
    total: any;
    addToCart: (product: Product, variant: ProductVariant) => void;
    updateQuantity: (itemId: string, newQuantity: number) => any;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
};
//# sourceMappingURL=usePosCart.d.ts.map