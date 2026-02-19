import type { Category } from '~~/shared/types';
type __VLS_Props = {
    categories: Category[];
    getProductCount: (categoryId: number) => number;
    getParentCategoryName: (parentId: number | null) => string;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    delete: (category: Category) => any;
    edit: (category: Category) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onDelete?: (category: Category) => any;
    onEdit?: (category: Category) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=CategoryList.vue.d.ts.map