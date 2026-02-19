import type { Category } from '~~/shared/types';
type __VLS_Props = {
    categories: Category[];
    selectedCategory: number | null;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:selectedCategory": (categoryId: number | null) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:selectedCategory"?: (categoryId: number | null) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=CategoryTabs.vue.d.ts.map