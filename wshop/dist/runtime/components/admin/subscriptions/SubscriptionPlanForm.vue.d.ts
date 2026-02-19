interface Plan {
    id?: number;
    name: string;
    price: number;
    interval: 'month' | 'year';
}
type __VLS_Props = {
    plan?: Plan | null;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    submit: (...args: any[]) => void;
    cancel: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSubmit?: (...args: any[]) => any;
    onCancel?: (...args: any[]) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=SubscriptionPlanForm.vue.d.ts.map