import type { CartItem, Customer, PaymentMethod } from '~~/shared/types';
type __VLS_Props = {
    cartItems: CartItem[];
    selectedCustomer: Customer | null;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethods: PaymentMethod[];
    selectedPaymentMethod: string | null;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update-quantity": (itemId: string, quantity: number) => any;
    "remove-from-cart": (itemId: string) => any;
    "update:selectedPaymentMethod": (methodId: string) => any;
    "process-payment": () => any;
    "suspend-sale": () => any;
    "clear-cart": () => any;
    "open-customer-modal": () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate-quantity"?: (itemId: string, quantity: number) => any;
    "onRemove-from-cart"?: (itemId: string) => any;
    "onUpdate:selectedPaymentMethod"?: (methodId: string) => any;
    "onProcess-payment"?: () => any;
    "onSuspend-sale"?: () => any;
    "onClear-cart"?: () => any;
    "onOpen-customer-modal"?: () => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=CartPanel.vue.d.ts.map