interface Props {
    show: boolean;
    amount: number;
    orderId?: string;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    error: (error: string) => any;
    close: () => any;
    success: (payment: any) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onError?: (error: string) => any;
    onClose?: () => any;
    onSuccess?: (payment: any) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=PaymentModal.vue.d.ts.map