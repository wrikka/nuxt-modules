import type { Product, Category } from '~~/shared/types';
type __VLS_Props = {
    products: Product[];
    categories: Category[];
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:selectedCategory": (categoryId: number | null) => any;
    "add-to-cart": (product: Product) => any;
    "update:searchQuery": (query: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:selectedCategory"?: (categoryId: number | null) => any;
    "onAdd-to-cart"?: (product: Product) => any;
    "onUpdate:searchQuery"?: (query: string) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=ProductSelectionPanel.vue.d.ts.map