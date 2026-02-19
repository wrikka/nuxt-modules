import type { PaymentMethod, CartItem } from '~~/shared/types';
type __VLS_Props = {
    paymentMethods: PaymentMethod[];
    selectedPaymentMethod: string | null;
    cartItems: CartItem[];
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:selectedPaymentMethod": (methodId: string) => any;
    "process-payment": () => any;
    "suspend-sale": () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:selectedPaymentMethod"?: (methodId: string) => any;
    "onProcess-payment"?: () => any;
    "onSuspend-sale"?: () => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=PaymentActions.vue.d.ts.map