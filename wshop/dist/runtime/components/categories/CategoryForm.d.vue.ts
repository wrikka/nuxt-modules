import type { Category } from '~~/shared/types';
type __VLS_Props = {
    modelValue: boolean;
    category: Partial<Category> | null;
    parentCategories: Category[];
    processing: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    save: (category: Category) => any;
    "update:modelValue": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSave?: (category: Category) => any;
    "onUpdate:modelValue"?: (value: boolean) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=CategoryForm.vue.d.ts.map