interface Rule {
    id?: number;
    name: string;
    conditions: string;
    action: string;
}
type __VLS_Props = {
    rule?: Rule | null;
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
//# sourceMappingURL=PricingRuleBuilder.vue.d.ts.map