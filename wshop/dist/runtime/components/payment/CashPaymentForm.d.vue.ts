interface Props {
    amount: number;
    loading?: boolean;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    cancel: () => any;
    pay: (payment: {
        amount: number;
        cashReceived: number;
    }) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onCancel?: () => any;
    onPay?: (payment: {
        amount: number;
        cashReceived: number;
    }) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=CashPaymentForm.vue.d.ts.map