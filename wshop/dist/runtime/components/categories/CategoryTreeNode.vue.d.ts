import type { CategoryTree } from '~~/shared/types';
type __VLS_Props = {
    category: CategoryTree;
    level: number;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    delete: (category: CategoryTree) => any;
    edit: (category: CategoryTree) => any;
    toggle: (category: CategoryTree) => any;
    "add-child": (category: CategoryTree) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onDelete?: (category: CategoryTree) => any;
    onEdit?: (category: CategoryTree) => any;
    onToggle?: (category: CategoryTree) => any;
    "onAdd-child"?: (category: CategoryTree) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=CategoryTreeNode.vue.d.ts.map