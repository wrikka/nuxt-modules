interface Props {
    show: boolean;
    processing?: boolean;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    submit: (data: {
        rating: number;
        title: string;
        content: string;
        images: string[];
    }) => any;
    close: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onSubmit?: (data: {
        rating: number;
        title: string;
        content: string;
        images: string[];
    }) => any;
    onClose?: () => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=ReviewForm.vue.d.ts.map