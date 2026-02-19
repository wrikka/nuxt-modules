import type { Category } from '#shared/types';
interface Props {
    categories?: Category[];
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    search: (query: string, filters: ProductFilters, sortBy: string) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onSearch?: (query: string, filters: ProductFilters, sortBy: string) => any;
}>, {
    categories: Category[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=ProductSearch.vue.d.ts.map