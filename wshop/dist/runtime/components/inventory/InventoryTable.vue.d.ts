import type { Inventory } from '~~/shared/types';
type __VLS_Props = {
    inventory: Inventory[];
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    edit: (item: Inventory) => any;
    viewHistory: (item: Inventory) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onEdit?: (item: Inventory) => any;
    onViewHistory?: (item: Inventory) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=InventoryTable.vue.d.ts.map