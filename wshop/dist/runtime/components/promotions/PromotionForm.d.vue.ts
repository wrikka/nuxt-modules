type __VLS_ModelProps = {
    'form'?: any;
    'processing'?: boolean;
    'editing'?: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_ModelProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (...args: any[]) => void;
    save: (...args: any[]) => void;
    "update:form": (value: any) => void;
    "update:processing": (value: boolean | undefined) => void;
    "update:editing": (value: boolean | undefined) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_ModelProps> & Readonly<{
    onClose?: (...args: any[]) => any;
    onSave?: (...args: any[]) => any;
    "onUpdate:form"?: (value: any) => any;
    "onUpdate:processing"?: (value: boolean | undefined) => any;
    "onUpdate:editing"?: (value: boolean | undefined) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=PromotionForm.vue.d.ts.map